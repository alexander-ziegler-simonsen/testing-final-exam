using hospitalApi.Controllers;
using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace hospitalApiTesting;

public class AuthControllerTests
{
    private static AuthController BuildController(Mock<IAuthService> authServiceMock, string scheme)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Scheme = scheme;

        return new AuthController(authServiceMock.Object, TestConfig.Build())
        {
            ControllerContext = new ControllerContext { HttpContext = httpContext }
        };
    }

    // Request.IsHttps drives the refresh cookie's Secure flag. A Postman run
    // against localhost is plain HTTP, so in practice the "Secure=true" branch
    // has never actually been exercised by anything - only a controller test
    // that can dictate the request scheme can hit both branches directly.
    [TestCase("https", true)]
    [TestCase("http", false)]
    public async Task Login_SetsRefreshCookieSecureFlag_MatchingRequestScheme(string scheme, bool expectSecure)
    {
        var authServiceMock = new Mock<IAuthService>();
        authServiceMock
            .Setup(s => s.Login(It.IsAny<LoginInputDto>()))
            .ReturnsAsync(new AuthTokens(new LoginOutputDto { Token = "access-token", Role = "patient" }, "raw-refresh-token"));

        var controller = BuildController(authServiceMock, scheme);

        await controller.Login(new LoginInputDto { Username = "annaj", Password = "Patient1234!" });

        var setCookieHeader = controller.Response.Headers.SetCookie.ToString();

        Assert.That(setCookieHeader, Does.Contain("refreshToken="));
        Assert.That(setCookieHeader.Contains("secure", StringComparison.OrdinalIgnoreCase), Is.EqualTo(expectSecure));
    }
}
