using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MissingStorageController : ControllerBase
    {
        private IMissingStorageService _MedicationStorageMissingService;

        public MissingStorageController(IMissingStorageService MedicationStorageMissingService)
        {
            _MedicationStorageMissingService = MedicationStorageMissingService;
        }


        // GET: api/<MedicationStorageMissingController>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<MedicationStorageMissingOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<MedicationStorageMissingOutputDto>> GetAllMedicationStorageMissings()
        {
            var output = await _MedicationStorageMissingService.GetAll();

            return output;
        }

        // GET api/<MedicationStorageMissingController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(MedicationStorageMissingOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MedicationStorageMissingOutputDto>> Get(int id)
        {
            MedicationStorageMissingOutputDto output = await _MedicationStorageMissingService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<MedicationStorageMissingController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<int>> Post([FromBody] MedicationStorageMissingInputDto newMedicationStorageMissing)
        {
            int newId = await _MedicationStorageMissingService.CreateMissingStorage(newMedicationStorageMissing);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<MedicationStorageMissingController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MedicationStorageMissingInputDto newMedicationStorageMissing)
        {
            bool output = await _MedicationStorageMissingService.EditMissingStorage(id, newMedicationStorageMissing);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<MedicationStorageMissingController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _MedicationStorageMissingService.DeleteMissingStorage(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }

}