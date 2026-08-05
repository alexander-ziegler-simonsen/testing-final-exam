using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;

namespace hospitalApi.Services.Interfaces
{
    public interface IStorageService
    {
        Task<IEnumerable<MedicationStorageOutputDto>> GetAll();
        Task<MedicationStorageOutputDto> GetOne(int id);
        Task<bool> EditStorage(int StorageId, MedicationStorageInputDto editedStorageData);
        Task<bool> DeleteStorage(int id);
        Task<int> CreateStorage(MedicationStorageInputDto newStorage);
    }
}
