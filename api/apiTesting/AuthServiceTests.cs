using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;

namespace hospitalApiTesting;

public class AuthServiceTests
{
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

        var configMock = new Mock<IConfiguration>();
        configMock.Setup(c => c["Jwt:Key"]).Returns("HospitalApiSuperSecretKey2025!MustBe32Chars+");
        configMock.Setup(c => c["Jwt:Issuer"]).Returns("hospitalApi");
        configMock.Setup(c => c["Jwt:Audience"]).Returns("hospitalFrontend");

        var service = new AuthService(context, configMock.Object);

        var result = await service.Login(new LoginInputDto { Username = "annaj", Password = "Patient1234!" });

        Assert.That(result, Is.Not.Null);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(result!.Token);
        Assert.That(jwt.Claims.First(c => c.Type == ClaimTypes.Role).Value, Is.EqualTo("patient"));
        Assert.That(jwt.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value, Is.EqualTo("1"));
    }
}
