using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ITreatmentStaffService
    {
        Task<IEnumerable<TreatmentStaffOutput>> GetAll();
        Task<TreatmentStaffOutput> GetOne(int id);
        Task<int> CreateTreatmentStaff(TreatmentStaffInput input);
        Task<bool> EditTreatmentStaff(int id, TreatmentStaffInput input);
        Task<bool> DeleteTreatmentStaff(int id);
    }
}
