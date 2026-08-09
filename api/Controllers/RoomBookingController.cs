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
    public class RoomBookingController : ControllerBase
    {
        private readonly IRoomBookingService _roomBookingService;

        public RoomBookingController(IRoomBookingService roomBookingService)
        {
            _roomBookingService = roomBookingService;
        }

        // GET: api/roombooking
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<RoomBookingOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<RoomBookingOutputDto>> GetAll()
        {
            return await _roomBookingService.GetAll();
        }

        // GET: api/roombooking/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(RoomBookingOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<RoomBookingOutputDto>> Get(int id)
        {
            var output = await _roomBookingService.GetOne(id);
            if (output == null) return NotFound();
            return Ok(output);
        }

        // POST: api/roombooking
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(string), StatusCodes.Status409Conflict)]
        public async Task<ActionResult<int>> Post([FromBody] RoomBookingInputDto newRoomBooking)
        {
            bool available = await _roomBookingService.IsRoomAvailable(
                newRoomBooking.FkRoomId,
                newRoomBooking.StartTime,
                newRoomBooking.EndTime
            );
            if (!available)
                return Conflict("Room is already booked for the requested time slot.");

            int newId = await _roomBookingService.CreateRoomBooking(newRoomBooking);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT: api/roombooking/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(string), StatusCodes.Status409Conflict)]
        public async Task<ActionResult> Put(int id, [FromBody] RoomBookingInputDto newRoomBooking)
        {
            bool available = await _roomBookingService.IsRoomAvailable(
                newRoomBooking.FkRoomId,
                newRoomBooking.StartTime,
                newRoomBooking.EndTime,
                excludeBookingId: id
            );
            if (!available)
                return Conflict("Room is already booked for the requested time slot.");

            bool output = await _roomBookingService.EditRoomBooking(id, newRoomBooking);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE: api/roombooking/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _roomBookingService.DeleteRoomBooking(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }
}
