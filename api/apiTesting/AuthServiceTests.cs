using AutoMapper;
using hospitalApi.Data;
using hospitalApi.DTOs.Inputs;
using hospitalApi.Mapping;
using hospitalApi.Models;
using hospitalApi.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;

namespace hospitalApiTesting;

[TestFixture]
public class AuthServiceTests
{
    private HospitalContext _context = null!;
    private AuthService _service = null!;

    // Pre-computed BCrypt hash for the string "correctpass"
    // Salt is embedded in the hash, so user.Salt = user.PasswordHash = this value
    private static readonly string CorrectPassword = "correctpass";
    private static string PasswordHash = null!;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        // BCrypt is slow by design; generate once for the whole fixture
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(CorrectPassword);
    }

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<HospitalContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new HospitalContext(options);

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "super-secret-key-at-least-32-chars-long!",
                ["Jwt:Issuer"] = "test-issuer",
                ["Jwt:Audience"] = "test-audience",
            })
            .Build();

        var mapperConfig = new MapperConfiguration(
            cfg => cfg.AddProfile(new MappingProfile()),
            NullLoggerFactory.Instance);
        var mapper = mapperConfig.CreateMapper();

        _service = new AuthService(_context, configuration, mapper);
    }

    [TearDown]
    public void TearDown() => _context.Dispose();

    private async Task SeedUser(string username = "testuser", int roleId = 1, string roleName = "doctor")
    {
        var role = new StaffRole { Id = roleId, Name = roleName };
        var staff = new Staff { Id = 1, Firstname = "Jane", Lastname = "Doe", FkRoleId = roleId, FkRole = role };
        var user = new User
        {
            Id = 1,
            Username = username,
            PasswordHash = PasswordHash,
            Salt = PasswordHash,
            FkStaffId = 1,
            FkStaff = staff,
        };

        _context.StaffRoles.Add(role);
        _context.Staff.Add(staff);
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }

    // Login – valid credentials

    [Test]
    public async Task Login_WithValidCredentials_ReturnsLoginOutput()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = CorrectPassword });

        Assert.That(result, Is.Not.Null);
    }

    [Test]
    public async Task Login_WithValidCredentials_TokenIsNotEmpty()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = CorrectPassword });

        Assert.That(result!.Token, Is.Not.Null.And.Not.Empty);
    }

    [Test]
    public async Task Login_WithValidCredentials_RoleMatchesSeedRole()
    {
        await SeedUser(roleName: "nurse");

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = CorrectPassword });

        Assert.That(result!.Role, Is.EqualTo("nurse"));
    }

    [Test]
    public async Task Login_WithValidCredentials_StaffIdMatchesSeedStaff()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = CorrectPassword });

        Assert.That(result!.StaffId, Is.EqualTo(1));
    }

    [Test]
    public async Task Login_WithValidCredentials_NamesMatchSeedStaff()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = CorrectPassword });

        Assert.That(result!.Firstname, Is.EqualTo("Jane"));
        Assert.That(result.Lastname, Is.EqualTo("Doe"));
    }

    // Login – wrong password

    [Test]
    public async Task Login_WithWrongPassword_ReturnsNull()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = "wrongpass" });

        Assert.That(result, Is.Null);
    }

    // Login – unknown username

    [Test]
    public async Task Login_WithUnknownUsername_ReturnsNull()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "nobody", Password = CorrectPassword });

        Assert.That(result, Is.Null);
    }

    // Login – empty database

    [Test]
    public async Task Login_WhenNoUsersExist_ReturnsNull()
    {
        var result = await _service.Login(new LoginInput { Username = "anyone", Password = "anything" });

        Assert.That(result, Is.Null);
    }

    // Token structure

    [Test]
    public async Task Login_WithValidCredentials_TokenIsAJwtString()
    {
        await SeedUser();

        var result = await _service.Login(new LoginInput { Username = "testuser", Password = CorrectPassword });

        // A JWT has three dot-separated base64url segments
        var parts = result!.Token.Split('.');
        Assert.That(parts, Has.Length.EqualTo(3));
    }
}
