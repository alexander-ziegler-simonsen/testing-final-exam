using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IDepartmentService
    {
        Task<IEnumerable<DepartmentOutputDto>> GetAll();
        Task<DepartmentOutputDto> GetOne(int id);
        Task<bool> EditDepartment(int DepartmentId, DepartmentInputDto editedDepartmentData);
        Task<bool> DeleteDepartment(int id);
        Task<int> CreateDepartment(DepartmentInputDto newDepartment);
    }
}
