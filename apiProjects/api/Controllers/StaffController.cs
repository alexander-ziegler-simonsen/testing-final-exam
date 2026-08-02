using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private IStaffService _StaffService;

        public StaffController(IStaffService StaffService)
        {
            _StaffService = StaffService;
        }


        // GET: api/<StaffController>
        [HttpGet]
        [ProducesResponseType(typeof(StaffOutput), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<StaffOutput>> GetAllStaffs()
        {
            var output = await _StaffService.GetAll();

            return output;
        }

        // GET api/<StaffController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(StaffOutput), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<StaffOutput>> Get(int id)
        {
            StaffOutput output = await _StaffService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<StaffController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] StaffInput newStaff)
        {
            int newId = await _StaffService.CreateStaff(newStaff);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<StaffController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] StaffInput newStaff)
        {
            bool output = await _StaffService.EditStaff(id, newStaff);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<StaffController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _StaffService.DeleteStaff(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }

}