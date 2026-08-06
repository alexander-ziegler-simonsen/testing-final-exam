using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IMedicinService
    {
        Task<IEnumerable<MedicationOutputDto>> GetAll();
        Task<MedicationOutputDto> GetOne(int id);
        Task<bool> EditMedication(int MedicationId, MedicationInputDto editedMedicationData);
        Task<bool> DeleteMedication(int id);
        Task<int> CreateMedication(MedicationInputDto newMedication);
    }
}
