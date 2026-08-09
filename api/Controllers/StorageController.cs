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
    public class StorageController : ControllerBase
    {
        private IStorageService _MedicationStorageService;

        public StorageController(IStorageService MedicationStorageService)
        {
            _MedicationStorageService = MedicationStorageService;
        }


        // GET: api/<MedicationStorageController>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<MedicationStorageOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<MedicationStorageOutputDto>> GetAllMedicationStorages()
        {
            var output = await _MedicationStorageService.GetAll();

            return output;
        }

        // GET api/<MedicationStorageController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(MedicationStorageOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MedicationStorageOutputDto>> Get(int id)
        {
            MedicationStorageOutputDto output = await _MedicationStorageService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<MedicationStorageController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<int>> Post([FromBody] MedicationStorageInputDto newMedicationStorage)
        {
            int newId = await _MedicationStorageService.CreateStorage(newMedicationStorage);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<MedicationStorageController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MedicationStorageInputDto newMedicationStorage)
        {
            bool output = await _MedicationStorageService.EditStorage(id, newMedicationStorage);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<MedicationStorageController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _MedicationStorageService.DeleteStorage(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }

}