using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Moq;
using NUnit.Framework;

namespace hospitalApiTesting.Controllers;

// Goes through the real HTTP pipeline (WebApplicationFactory) instead of calling
// the controller directly, because [Authorize] is enforced by middleware that
// never runs when a controller is instantiated and invoked in isolation - a plain
// "new ExternalMedicinePricesController(mock)" test could never actually observe a 401.
// IExternalApiService is swapped for a mock in DI, so no real external HTTP call is made.
public class ExternalMedicinePricesControllerTest
{
    private WebApplicationFactory<Program> _factory;
    private Mock<IExternalApiService> _externalApiServiceMock;

    [SetUp]
    public void Setup()
    {
        _externalApiServiceMock = new Mock<IExternalApiService>();

        _factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                // Tripwire: if a request path ever forgets to hit the mock and falls
                // through to the real HospitalContext, this fails loud instead of
                // silently reaching a real database.
                builder.UseSetting("ConnectionStrings:DefaultConnection",
                    "Host=unused-in-tests;Database=unused;Username=unused;Password=unused;");

                builder.ConfigureTestServices(services =>
                {
                    services.RemoveAll<IExternalApiService>();
                    services.AddScoped(_ => _externalApiServiceMock.Object);
                });
            });
    }

    [TearDown]
    public void TearDown()
    {
        _factory.Dispose();
    }

    [Test]
    public async Task GetMedicineProductsByName_WithoutAuthToken_Returns401()
    {
        // Arrange
        var client = _factory.CreateClient();

        // Act
        var response = await client.GetAsync("/api/externalmedicineprices/productsByName?productName=Aspirin");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));
        _externalApiServiceMock.Verify(s => s.GetMedicineProductsByNameAsync(It.IsAny<string>()), Times.Never);
    }

    [Test]
    public async Task GetMedicineProductsByName_WhenServiceThrows_Returns500()
    {
        // Arrange
        _externalApiServiceMock.Setup(s => s.GetMedicineProductsByNameAsync(It.IsAny<string>()))
            .ThrowsAsync(new InvalidOperationException("boom"));
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", BuildAccessToken());

        // Act
        var response = await client.GetAsync("/api/externalmedicineprices/productsByName?productName=Aspirin");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.InternalServerError));
    }

    // Sanity/control case: proves the WebApplicationFactory + forged-JWT + DI-mock
    // wiring actually works end to end, so a pass on the 401/500 tests above means
    // something real, not an artifact of a broken harness.
    [Test]
    public async Task GetMedicineProductsByName_WithValidToken_ReturnsOkFromMockedService()
    {
        // Arrange
        _externalApiServiceMock.Setup(s => s.GetMedicineProductsByNameAsync(It.IsAny<string>())).ReturnsAsync([]);
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", BuildAccessToken());

        // Act
        var response = await client.GetAsync("/api/externalmedicineprices/productsByName?productName=Aspirin");

        // Assert
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        _externalApiServiceMock.Verify(s => s.GetMedicineProductsByNameAsync("Aspirin"), Times.Once);
    }

    private static string BuildAccessToken()
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestConfig.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: TestConfig.Issuer,
            audience: TestConfig.Audience,
            claims: [new Claim(JwtRegisteredClaimNames.Sub, "1")],
            expires: DateTime.UtcNow.AddMinutes(5),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
