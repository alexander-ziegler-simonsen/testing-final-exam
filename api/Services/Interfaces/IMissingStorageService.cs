using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IMissingStorageService
    {
        Task<IEnumerable<MedicationStorageMissingOutputDto>> GetAll();
        Task<MedicationStorageMissingOutputDto> GetOne(int id);
        Task<bool> EditMissingStorage(int MissingStorageId, MedicationStorageMissingInputDto editedMissingStorageData);
        Task<bool> DeleteMissingStorage(int id);
        Task<int> CreateMissingStorage(MedicationStorageMissingInputDto newMissingStorage);
    }
}
