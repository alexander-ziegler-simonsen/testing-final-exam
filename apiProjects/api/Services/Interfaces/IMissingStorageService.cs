using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IMissingStorageService
    {
        Task<IEnumerable<MedicationStorageMissingOutput>> GetAll();
        Task<MedicationStorageMissingOutput> GetOne(int id);
        Task<bool> EditMissingStorage(int MissingStorageId, MedicationStorageMissingInput editedMissingStorageData);
        Task<bool> DeleteMissingStorage(int id);
        Task<int> CreateMissingStorage(MedicationStorageMissingInput newMissingStorage);
    }
}
