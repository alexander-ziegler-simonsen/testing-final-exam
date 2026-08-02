using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface ITreatmentService
    {
        Task<IEnumerable<TreatmentOutputDto>> GetAll(TreatmentInputDto? filter = null, string? sortBy = null, string? sortDir = "asc");
        Task<TreatmentOutputDto> GetOne(int id);
        Task<bool> EditTreatment(int TreatmentId, TreatmentInputDto editedTreatmentData);
        Task<bool> DeleteTreatment(int id);
        Task<int> CreateTreatment(TreatmentInputDto newTreatment);
    }
}
