using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IStorageService
    {
        Task<IEnumerable<MedicationStorageOutput>> GetAll();
        Task<MedicationStorageOutput> GetOne(int id);
        Task<bool> EditStorage(int StorageId, MedicationStorageInput editedStorageData);
        Task<bool> DeleteStorage(int id);
        Task<int> CreateStorage(MedicationStorageInput newStorage);
    }
}
