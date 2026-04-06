using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IStaffService
    {
        Task<IEnumerable<StaffOutput>> GetAll();
        Task<StaffOutput> GetOne(int id);
        Task<bool> EditStaff(int StaffId, StaffInput editedStaffData);
        Task<bool> DeleteStaff(int id);
        Task<bool> CreateStaff(StaffInput newStaff);
    }
}
