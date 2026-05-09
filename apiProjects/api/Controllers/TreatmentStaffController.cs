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
        public async Task<IEnumerable<TreatmentStaffOutput>> GetAll()
        {
            return await _TreatmentStaffService.GetAll();
        }

        // GET api/<TreatmentStaffController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TreatmentStaffOutput>> Get(int id)
        {
            TreatmentStaffOutput output = await _TreatmentStaffService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<TreatmentStaffController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TreatmentStaffInput input)
        {
            bool output = await _TreatmentStaffService.CreateTreatmentStaff(input);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // PUT api/<TreatmentStaffController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TreatmentStaffInput input)
        {
            bool output = await _TreatmentStaffService.EditTreatmentStaff(id, input);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<TreatmentStaffController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _TreatmentStaffService.DeleteTreatmentStaff(id);

            if (output)
                return Ok();
            else
                return NoContent();
        }
    }
}
