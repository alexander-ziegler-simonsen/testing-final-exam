using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    // Carries the raw refresh token alongside the response DTO so the controller can
    // put it in an httpOnly cookie without it ever being serialized into the JSON body.
    public record AuthTokens(LoginOutputDto Output, string RefreshToken);

    public interface IAuthService
    {
        Task<AuthTokens?> Login(LoginInputDto credentials);
        Task<AuthTokens?> Refresh(string rawRefreshToken);
        void Logout(string rawRefreshToken);
    }
}
