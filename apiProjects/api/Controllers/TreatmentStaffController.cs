using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentStaffController : ControllerBase
    {
        private ITreatmentStaffService _TreatmentStaffService;

        public TreatmentStaffController(ITreatmentStaffService treatmentStaffService)
        {
            _TreatmentStaffService = treatmentStaffService;
        }

        // GET: api/<TreatmentStaffController>
        [HttpGet]
        [ProducesResponseType(typeof(TreatmentStaffOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<TreatmentStaffOutputDto>> GetAll()
        {
            return await _TreatmentStaffService.GetAll();
        }

        // GET api/<TreatmentStaffController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TreatmentStaffOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TreatmentStaffOutputDto>> Get(int id)
        {
            TreatmentStaffOutputDto output = await _TreatmentStaffService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<TreatmentStaffController>
        [HttpPost]
        public async Task<ActionResult<int>> Post([FromBody] TreatmentStaffInputDto input)
        {
            int newId = await _TreatmentStaffService.CreateTreatmentStaff(input);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<TreatmentStaffController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TreatmentStaffInputDto input)
        {
            bool output = await _TreatmentStaffService.EditTreatmentStaff(id, input);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<TreatmentStaffController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _TreatmentStaffService.DeleteTreatmentStaff(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }
}
