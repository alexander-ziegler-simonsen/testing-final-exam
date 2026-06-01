using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private IPatientService _PatientService;

        public PatientController(IPatientService PatientService)
        {
            _PatientService = PatientService;
        }


        // GET: api/<PatientController>
        [HttpGet]
        public async Task<IEnumerable<PatientOutput>> GetAllPatients(
            [FromQuery] PatientInput? filter = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDir = "asc")
        {
            return await _PatientService.GetAll(filter, sortBy, sortDir);
        }

        // GET api/<PatientController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientOutput>> Get(int id)
        {
            PatientOutput output = await _PatientService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<PatientController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PatientInput newPatient)
        {
            int newId = await _PatientService.CreatePatient(newPatient);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<PatientController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PatientInput newPatient)
        {
            bool output = await _PatientService.EditPatient(id, newPatient);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<PatientController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _PatientService.DeletePatient(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }
}
