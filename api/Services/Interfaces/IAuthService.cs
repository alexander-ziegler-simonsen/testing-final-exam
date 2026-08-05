using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginOutputDto?> Login(LoginInputDto credentials);
    }
}
