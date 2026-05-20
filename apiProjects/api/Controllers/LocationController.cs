using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }


        // GET: api/<LocationController>
        [HttpGet]
        public async Task<IEnumerable<LocationOutput>> GetAllLocations()
        {
            var output = await _locationService.getAllLocations();

            return output;
        }

        // GET api/<LocationController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LocationOutput>> Get(int id)
        {
            LocationOutput output = await _locationService.getOneLocations(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // GET api/location/floor
        [HttpGet("floor")]
        public async Task<IEnumerable<FloorRoomsOutput>> GetAllFloors()
        {
            return await _locationService.getOneAllFloors();
        }

        // GET api/location/floor/5
        [HttpGet("floor/{id}")]
        public async Task<ActionResult<FloorRoomsOutput>> GetFloor(int id)
        {
            var output = await _locationService.getOneFloorWithRooms(id);
            if (output == null)
                return NotFound();
            return Ok(output);
        }

        // POST api/location/floor
        [HttpPost("floor")]
        public async Task<ActionResult<int>> PostFloor([FromBody] FloorInput input)
        {
            var newId = await _locationService.PostOneFloor(input);
            return Ok(newId);
        }

        // PUT api/location/floor/5
        [HttpPut("floor/{id}")]
        public async Task<ActionResult> PutFloor(int id, [FromBody] FloorInput input)
        {
            var success = await _locationService.EditOnefloor(id, input);
            if (!success)
                return NotFound();
            return NoContent();
        }

        // DELETE api/location/floor/5
        [HttpDelete("floor/{id}")]
        public async Task<ActionResult> DeleteFloor(int id)
        {
            var success = await _locationService.DeleteOneFloor(id);
            if (!success)
                return NotFound();
            return NoContent();
        }
    }
}
