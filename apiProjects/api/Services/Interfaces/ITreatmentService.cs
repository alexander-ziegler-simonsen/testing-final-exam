using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ITreatmentService
    {
        Task<IEnumerable<TreatmentOutput>> GetAll(TreatmentInput? filter = null, string? sortBy = null, string? sortDir = "asc");
        Task<TreatmentOutput> GetOne(int id);
        Task<bool> EditTreatment(int TreatmentId, TreatmentInput editedTreatmentData);
        Task<bool> DeleteTreatment(int id);
        Task<int> CreateTreatment(TreatmentInput newTreatment);
    }
}
