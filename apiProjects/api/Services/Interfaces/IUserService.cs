using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserOutput>> GetAll();
        Task<bool> Register(RegisterInput input);
        Task<bool> ChangePassword(int id, string newPassword);
        Task<bool> Delete(int id);
    }
}
