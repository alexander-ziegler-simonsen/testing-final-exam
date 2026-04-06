using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ITreatmentService
    {
        Task<IEnumerable<TreatmentOutput>> GetAll();
        Task<TreatmentOutput> GetOne(int id);
        Task<bool> EditTreatment(int TreatmentId, TreatmentInput editedTreatmentData);
        Task<bool> DeleteTreatment(int id);
        Task<bool> CreateTreatment(TreatmentInput newTreatment);
    }
}
