using hospitalApi.DTOs.External;
using hospitalApi.Services.Interfaces;
using Microsoft.Build.Framework;
using System.Collections;
using System.Text.Json;
using System.Xml.Linq;

namespace hospitalApi.Services
{
    public class ExternalApiService : IExternalApiService
    {
        private readonly HttpClient _httpClient;

        JsonSerializerOptions _theSetting;

        public ExternalApiService(HttpClient httpClient)  
        {
            _httpClient = httpClient;
            _theSetting = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
        }

        public async Task<IEnumerable<MedicineProductOutput>> GetMedicineProductsByNameAsync(string productName)
        {
            var response = await _httpClient.GetAsync($"produkter/{productName}?format=json");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<MedicineProductOutput>>(json, _theSetting);
        }
        public async Task<IEnumerable<MedicineProductOutput>> GetMedicineProductsByIngredientsAsync(string ingredientName)
        {
            var response = await _httpClient.GetAsync($"produkter/virksomtstof/{ingredientName}?format=json");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<MedicineProductOutput>>(json, _theSetting);
        }
        public async Task<MedicineDetailOutput> GetMedicineProductDetailsAsync(string productDetailId)
        {
            var response = await _httpClient.GetAsync($"produkter/detaljer/{productDetailId}?format=json");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<MedicineDetailOutput>(json, _theSetting);
        }
    }
}
