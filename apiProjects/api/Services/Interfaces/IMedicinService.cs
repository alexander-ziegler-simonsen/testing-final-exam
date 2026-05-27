using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IMedicinService
    {
        Task<IEnumerable<MedicationOutput>> GetAll();
        Task<MedicationOutput> GetOne(int id);
        Task<bool> EditMedication(int MedicationId, MedicationInput editedMedicationData);
        Task<bool> DeleteMedication(int id);
        Task<int> CreateMedication(MedicationInput newMedication);
    }
}
