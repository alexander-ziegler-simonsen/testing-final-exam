using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private IShiftService _ShiftService;

        public ShiftController(IShiftService ShiftService)
        {
            _ShiftService = ShiftService;
        }


        // GET: api/<ShiftController>
        [HttpGet]
        public async Task<IEnumerable<ShiftOutput>> GetAllShifts(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDir = "asc")
        {
            return await _ShiftService.GetAll(from, to, sortBy, sortDir);
        }

        // GET api/<ShiftController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShiftOutput>> Get(int id)
        {
            ShiftOutput output = await _ShiftService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<ShiftController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ShiftInput newShift)
        {
            int newId = await _ShiftService.CreateShift(newShift);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<ShiftController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ShiftInput newShift)
        {
            bool output = await _ShiftService.EditShift(id, newShift);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<ShiftController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _ShiftService.DeleteShift(id);

            if (output)
                return Ok();
            else
                return NoContent();
        }
    }

}