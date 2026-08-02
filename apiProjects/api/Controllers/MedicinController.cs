using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicinController : ControllerBase
    {
        private IMedicinService _MedicinService;

        public MedicinController(IMedicinService MedicinService)
        {
            _MedicinService = MedicinService;
        }


        // GET: api/<MedicinController>
        [HttpGet]
        [ProducesResponseType(typeof(MedicationOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<MedicationOutputDto>> GetAllMedicins()
        {
            var output = await _MedicinService.GetAll();

            return output;
        }

        // GET api/<MedicinController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(MedicationOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<MedicationOutputDto>> Get(int id)
        {
            MedicationOutputDto output = await _MedicinService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<MedicinController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MedicationInputDto newMedicin)
        {
            int newId = await _MedicinService.CreateMedication(newMedicin);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<MedicinController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] MedicationInputDto newMedicin)
        {
            bool output = await _MedicinService.EditMedication(id, newMedicin);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<MedicinController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _MedicinService.DeleteMedication(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }

}