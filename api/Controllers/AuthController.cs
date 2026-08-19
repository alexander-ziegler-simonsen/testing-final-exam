using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private const string RefreshCookieName = "refreshToken";

        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(typeof(LoginOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginOutputDto>> Login([FromBody] LoginInputDto credentials)
        {
            var result = await _authService.Login(credentials);
            if (result == null)
                return Unauthorized();

            SetRefreshCookie(result.RefreshToken);
            return Ok(result.Output);
        }

        [AllowAnonymous]
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(LoginOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginOutputDto>> Refresh()
        {
            if (!Request.Cookies.TryGetValue(RefreshCookieName, out var rawRefreshToken) || string.IsNullOrEmpty(rawRefreshToken))
                return Unauthorized();

            var result = await _authService.Refresh(rawRefreshToken);
            if (result == null)
            {
                Response.Cookies.Delete(RefreshCookieName);
                return Unauthorized();
            }

            SetRefreshCookie(result.RefreshToken);
            return Ok(result.Output);
        }

        [Authorize]
        [HttpPost("logout")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult Logout()
        {
            if (Request.Cookies.TryGetValue(RefreshCookieName, out var rawRefreshToken) && !string.IsNullOrEmpty(rawRefreshToken))
                _authService.Logout(rawRefreshToken);

            Response.Cookies.Delete(RefreshCookieName);
            return NoContent();
        }

        private void SetRefreshCookie(string rawRefreshToken)
        {
            var days = _configuration.GetValue<int?>("Jwt:RefreshTokenDays") ?? 1;

            Response.Cookies.Append(RefreshCookieName, rawRefreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(days)
            });
        }
    }
}
