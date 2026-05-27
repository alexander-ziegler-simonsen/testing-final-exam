using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : ControllerBase
    {
        private IStorageService _MedicationStorageService;

        public StorageController(IStorageService MedicationStorageService)
        {
            _MedicationStorageService = MedicationStorageService;
        }


        // GET: api/<MedicationStorageController>
        [HttpGet]
        public async Task<IEnumerable<MedicationStorageOutput>> GetAllMedicationStorages()
        {
            var output = await _MedicationStorageService.GetAll();

            return output;
        }

        // GET api/<MedicationStorageController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationStorageOutput>> Get(int id)
        {
            MedicationStorageOutput output = await _MedicationStorageService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<MedicationStorageController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MedicationStorageInput newMedicationStorage)
        {
            int newId = await _MedicationStorageService.CreateStorage(newMedicationStorage);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<MedicationStorageController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MedicationStorageInput newMedicationStorage)
        {
            bool output = await _MedicationStorageService.EditStorage(id, newMedicationStorage);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<MedicationStorageController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _MedicationStorageService.DeleteStorage(id);

            if (output)
                return Ok();
            else
                return NoContent();
        }
    }

}