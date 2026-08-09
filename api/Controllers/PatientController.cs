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
    public class PatientController : ControllerBase
    {
        private IPatientService _PatientService;
        private ICprService _CprService;

        public PatientController(IPatientService PatientService, ICprService CprService)
        {
            _PatientService = PatientService;
            _CprService = CprService;
        }


        // GET: api/<PatientController>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PatientOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<PatientOutputDto>> GetAllPatients(
            [FromQuery] PatientInputDto? filter = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDir = "asc")
        {
            return await _PatientService.GetAll(filter, sortBy, sortDir);
        }

        // GET api/<PatientController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PatientOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PatientOutputDto>> Get(int id)
        {
            PatientOutputDto output = await _PatientService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<PatientController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<int>> Post([FromBody] PatientInputDto newPatient)
        {
            int newId = await _PatientService.CreatePatient(newPatient);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // POST api/<PatientController>/register-baby
        [HttpPost("register-baby")]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<int>> RegisterBaby([FromBody] RegisterBabyDto newBaby)
        {
            string cprNumber;
            try
            {
                cprNumber = _CprService.GenerateCprNumber(newBaby.DateOfBirth, newBaby.Gender ?? string.Empty);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            var patientInput = new PatientInputDto
            {
                Firstname = newBaby.Firstname,
                Lastname = newBaby.Lastname,
                Gender = newBaby.Gender,
                CprNumber = cprNumber,
                DateOfBirth = newBaby.DateOfBirth
            };

            int newId = await _PatientService.CreatePatient(patientInput);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<PatientController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PatientInputDto newPatient)
        {
            bool output = await _PatientService.EditPatient(id, newPatient);

            if (output)
                return Ok();
            else
                return NotFound();
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
