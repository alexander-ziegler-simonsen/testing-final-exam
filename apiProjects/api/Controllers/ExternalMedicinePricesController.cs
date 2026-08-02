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

        public ExternalMedicinePricesController(IExternalApiService externalApiService)
        {
            _externalApiService = externalApiService;
        }

        // GET api/<ExternalMedicinePricesController>/productsByName/
        [HttpGet("productsByName")]
        [ProducesResponseType(typeof(MedicineProductOutput), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<MedicineProductOutput>> GetMedicineProductsByName([FromQuery] string productName)
        {
            var output = await _externalApiService.GetMedicineProductsByNameAsync(productName);

            return output;
        }

        // GET api/<ExternalMedicinePricesController>/productsByIngredient
        [HttpGet("productsByIngredient")]
        [ProducesResponseType(typeof(MedicineProductOutput), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<MedicineProductOutput>> GetMedicineProductsByIngredients([FromQuery] string ingredientName)
        {
            var output = await _externalApiService.GetMedicineProductsByIngredientsAsync(ingredientName);

            return output;
        }

        // GET api/<ExternalMedicinePricesController>/productDetails
        [HttpGet("productDetails")]
        [ProducesResponseType(typeof(MedicineDetailOutput), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MedicineDetailOutput>> GetMedicineProductDetailsAsync([FromQuery] string productDetailId)
        {
            var output = await _externalApiService.GetMedicineProductDetailsAsync(productDetailId);

            return output;
        }

    }
}
