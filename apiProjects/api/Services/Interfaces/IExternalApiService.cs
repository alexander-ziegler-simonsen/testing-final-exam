using hospitalApi.DTOs.External;

namespace hospitalApi.Services.Interfaces
{
    public interface IExternalApiService
    {
        Task<IEnumerable<MedicineProductOutputDto>> GetMedicineProductsByNameAsync(string productName);
        Task<IEnumerable<MedicineProductOutputDto>> GetMedicineProductsByIngredientsAsync(string ingredientName);
        Task<MedicineDetailOutputDto> GetMedicineProductDetailsAsync(string productDetailId);
    }
}
