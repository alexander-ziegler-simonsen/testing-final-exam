using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.Models;
using hospitalApi.Services;
using hospitalApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Moq;

namespace hospitalApiTesting;

public class AuthServiceTests
{
    private static HospitalContext NewInMemoryContext() =>
        new(new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options);

    // Same shape AuthService.GenerateRefreshToken produces, but with the signing
    // key/claims a test wants to tamper with - lets us forge tokens the real
    // service would never mint, which is the only way to exercise the reject
    // branches of ValidateRefreshToken (Postman can't sign a JWT with the wrong key).
    private static string BuildToken(string signingKey, IEnumerable<Claim> claims, DateTime expiresUtc)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: TestConfig.Issuer,
            audience: TestConfig.Audience,
            claims: claims,
            expires: expiresUtc,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    // Postman only ever sees "a token string" in the login response - it
    // doesn't decode the JWT and check which claims ended up inside it. This
    // proves that a patient-linked user (no FkStaff) gets a token with
    // Role=patient and the patient's own id as the identifier, which is the
    // fallback logic in AuthService.GenerateToken (FkStaff?.Id ?? UserPatient?.FkPatientId).
    [Test]
    public async Task Login_ForPatientLinkedUser_TokenContainsPatientRoleAndId()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        using var context = new HospitalContext(options);

        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Patient1234!", salt);

        var patient = new Patient { Id = 1, Firstname = "Anna", Lastname = "Jensen" };
        var user = new User
        {
            Id = 1,
            Username = "annaj",
            PasswordHash = passwordHash,
            Salt = salt
        };
        context.Patients.Add(patient);
        context.Users.Add(user);
        context.UserPatients.Add(new UserPatient { Id = 1, FkUserId = user.Id, FkPatientId = patient.Id });
        await context.SaveChangesAsync();

        var configuration = TestConfig.Build();
        var revokedTokenStoreMock = new Mock<IRevokedTokenStore>();

        var service = new AuthService(context, configuration, revokedTokenStoreMock.Object);

        var result = await service.Login(new LoginInputDto { Username = "annaj", Password = "Patient1234!" });

        Assert.That(result, Is.Not.Null);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(result!.Output.Token);
        Assert.That(jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value, Is.EqualTo("patient"));
        Assert.That(jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value, Is.EqualTo("1"));
    }

    // A refresh token signed with the access-token key (Jwt:Key) instead of the
    // dedicated refresh key (Jwt:RefreshKey) must be rejected outright - otherwise
    // a leaked access-token key alone would be enough to mint working refresh
    // tokens, defeating the whole point of using two separate keys.
    [Test]
    public async Task Refresh_TokenSignedWithAccessKeyInsteadOfRefreshKey_ReturnsNull()
    {
        using var context = NewInMemoryContext();
        var service = new AuthService(context, TestConfig.Build(), new Mock<IRevokedTokenStore>().Object);

        var forgedToken = BuildToken(TestConfig.Key,
        [
            new Claim(JwtRegisteredClaimNames.Sub, "1"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("token_use", "refresh")
        ], DateTime.UtcNow.AddDays(7));

        var result = await service.Refresh(forgedToken);

        Assert.That(result, Is.Null);
    }

    // A correctly-signed access token (token_use=access, or the claim missing
    // entirely) must not be usable as a refresh token, even though it validates
    // fine against the same issuer/audience/lifetime rules.
    [TestCase("access")]
    [TestCase(null)]
    public async Task Refresh_TokenWithWrongOrMissingTokenUseClaim_ReturnsNull(string? tokenUse)
    {
        using var context = NewInMemoryContext();
        var service = new AuthService(context, TestConfig.Build(), new Mock<IRevokedTokenStore>().Object);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, "1"),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        if (tokenUse != null)
            claims.Add(new Claim("token_use", tokenUse));

        var forgedToken = BuildToken(TestConfig.RefreshKey, claims, DateTime.UtcNow.AddDays(7));

        var result = await service.Refresh(forgedToken);

        Assert.That(result, Is.Null);
    }

    // Rotation: once a refresh token has been used to obtain a new pair, that
    // exact raw token must never work again, even though it hasn't naturally
    // expired. This is the replay-protection guarantee RevokeJti exists for.
    [Test]
    public async Task Refresh_SameRawTokenUsedTwice_SecondCallReturnsNull()
    {
        using var context = NewInMemoryContext();

        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Patient1234!", salt);
        var patient = new Patient { Id = 1, Firstname = "Anna", Lastname = "Jensen" };
        var user = new User { Id = 1, Username = "annaj", PasswordHash = passwordHash, Salt = salt };
        context.Patients.Add(patient);
        context.Users.Add(user);
        context.UserPatients.Add(new UserPatient { Id = 1, FkUserId = user.Id, FkPatientId = patient.Id });
        await context.SaveChangesAsync();

        // Real store, not a mock: rotation state has to actually persist between the two calls.
        var revokedTokenStore = new RevokedTokenStore();
        var service = new AuthService(context, TestConfig.Build(), revokedTokenStore);

        var loginResult = await service.Login(new LoginInputDto { Username = "annaj", Password = "Patient1234!" });
        var rawRefreshToken = loginResult!.RefreshToken;

        var firstRefresh = await service.Refresh(rawRefreshToken);
        var secondRefresh = await service.Refresh(rawRefreshToken);

        Assert.That(firstRefresh, Is.Not.Null);
        Assert.That(secondRefresh, Is.Null);
    }

    // Logout is reachable with whatever a client happens to send as the refresh
    // cookie - it must swallow anything that isn't a readable JWT rather than
    // throwing, and it must not touch the revocation store for it.
    [Test]
    public void Logout_WithUnreadableTokenString_DoesNotThrowAndDoesNotRevoke()
    {
        using var context = NewInMemoryContext();
        var revokedTokenStoreMock = new Mock<IRevokedTokenStore>();
        var service = new AuthService(context, TestConfig.Build(), revokedTokenStoreMock.Object);

        Assert.DoesNotThrow(() => service.Logout("not-a-jwt-at-all"));

        revokedTokenStoreMock.Verify(
            s => s.Revoke(It.IsAny<string>(), It.IsAny<DateTime>()),
            Times.Never);
    }
}
