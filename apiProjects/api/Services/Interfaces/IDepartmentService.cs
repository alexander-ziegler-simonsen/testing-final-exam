using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentOutput>> GetAll();
        Task<DepartmentOutput> GetOne(int id);
        Task<bool> EditDepartment(int DepartmentId, DepartmentInput editedDepartmentData);
        Task<bool> DeleteDepartment(int id);
        Task<bool> CreateDepartment(DepartmentInput newDepartment);
    }
}
