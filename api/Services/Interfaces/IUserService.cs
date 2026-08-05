using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserOutputDto>> GetAll();
        Task<bool> Register(RegisterInputDto input);
        Task<bool> ChangePassword(int id, string newPassword);
        Task<bool> Delete(int id);
    }
}
