using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IStaffService
    {
        Task<IEnumerable<StaffOutputDto>> GetAll();
        Task<StaffOutputDto?> GetOne(int id);
        Task<int> GetStaffCount();
        
        Task<bool> EditStaff(int StaffId, StaffInputDto editedStaffData);
        Task<bool> DeleteStaff(int id);
        Task<int> CreateStaff(StaffInputDto newStaff);
    }
}
