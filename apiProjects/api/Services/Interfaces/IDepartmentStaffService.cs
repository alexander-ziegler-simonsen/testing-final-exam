using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IDepartmentStaffService
    {
        Task<IEnumerable<DepartmentStaffOutputDto>> GetAll();
        Task<DepartmentStaffOutputDto> GetOne(int id);
        Task<int> CreateDepartmentStaff(DepartmentStaffInputDto input);
        Task<bool> EditDepartmentStaff(int id, DepartmentStaffInputDto input);
        Task<bool> DeleteDepartmentStaff(int id);
    }
}
