using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginOutput?> Login(LoginInput credentials);
    }
}
