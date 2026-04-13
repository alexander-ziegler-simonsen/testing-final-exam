using hospitalApi.DTOs.External;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExternalMedicinePricesController : ControllerBase
    {
        public IExternalApiService _externalApiService;

        public ExternalMedicinePricesController (IExternalApiService externalApiService)
        {
            _externalApiService = externalApiService;
        }

        // GET api/<ExternalMedicinePricesController>/productsByIngredient/
        [HttpGet("productsByName")]
        public async Task<IActionResult> GetMedicineProductsByName([FromQuery] string productName)
        {
            var output = await _externalApiService.GetMedicineProductsByNameAsync(productName);

            return Ok(output);
        }

        // GET api/<ExternalMedicinePricesController>/productsByIngredient
        [HttpGet("productsByIngredient")]
        public async Task<IActionResult> GetMedicineProductsByIngredients([FromQuery] string ingredientName)
        {
            var output = await _externalApiService.GetMedicineProductsByIngredientsAsync(ingredientName);

            return Ok(output);
        }

        // GET api/<ExternalMedicinePricesController>/productDetails
        [HttpGet("productDetails")]
        public async Task<IActionResult> GetMedicineProductDetailsAsync([FromQuery] string productDetailId)
        {
            var output = await _externalApiService.GetMedicineProductDetailsAsync(productDetailId);

            return Ok(output);
        }

    }
}
