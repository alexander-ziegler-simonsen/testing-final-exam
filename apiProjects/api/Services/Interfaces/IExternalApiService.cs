using hospitalApi.DTOs.External;

namespace hospitalApi.Services.Interfaces
{
    public interface IExternalApiService
    {
        Task<IEnumerable<MedicineProductOutput>> GetMedicineProductsByNameAsync(string productName);
        Task<IEnumerable<MedicineProductOutput>> GetMedicineProductsByIngredientsAsync(string ingredientName);
        Task<MedicineDetailOutput> GetMedicineProductDetailsAsync(string productDetailId);
    }
}
