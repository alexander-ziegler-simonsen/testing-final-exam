using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ITreatmentStaffService
    {
        Task<IEnumerable<TreatmentStaffOutputDto>> GetAll();
        Task<TreatmentStaffOutputDto> GetOne(int id);
        Task<int> CreateTreatmentStaff(TreatmentStaffInputDto input);
        Task<bool> EditTreatmentStaff(int id, TreatmentStaffInputDto input);
        Task<bool> DeleteTreatmentStaff(int id);
    }
}
