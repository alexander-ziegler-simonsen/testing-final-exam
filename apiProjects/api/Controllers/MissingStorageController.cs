using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
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
        public async Task<IEnumerable<MedicationStorageMissingOutput>> GetAllMedicationStorageMissings()
        {
            var output = await _MedicationStorageMissingService.GetAll();

            return output;
        }

        // GET api/<MedicationStorageMissingController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationStorageMissingOutput>> Get(int id)
        {
            MedicationStorageMissingOutput output = await _MedicationStorageMissingService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<MedicationStorageMissingController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MedicationStorageMissingInput newMedicationStorageMissing)
        {
            int newId = await _MedicationStorageMissingService.CreateMissingStorage(newMedicationStorageMissing);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<MedicationStorageMissingController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MedicationStorageMissingInput newMedicationStorageMissing)
        {
            bool output = await _MedicationStorageMissingService.EditMissingStorage(id, newMedicationStorageMissing);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<MedicationStorageMissingController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _MedicationStorageMissingService.DeleteMissingStorage(id);

            if (output)
                return Ok();
            else
                return NoContent();
        }
    }

}