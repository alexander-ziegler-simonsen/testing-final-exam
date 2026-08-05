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
        [ProducesResponseType(typeof(IEnumerable<StaffOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<StaffOutputDto>> GetAllStaffs()
        {
            var output = await _StaffService.GetAll();

            return output;
        }

        // GET api/<StaffController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(StaffOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<StaffOutputDto>> Get(int id)
        {
            StaffOutputDto output = await _StaffService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<StaffController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<int>> Post([FromBody] StaffInputDto newStaff)
        {
            int newId = await _StaffService.CreateStaff(newStaff);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<StaffController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] StaffInputDto newStaff)
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