using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
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
        public async Task<IEnumerable<RoomBookingOutput>> GetAll()
        {
            return await _roomBookingService.GetAll();
        }

        // GET: api/roombooking/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomBookingOutput>> Get(int id)
        {
            var output = await _roomBookingService.GetOne(id);
            if (output == null) return NotFound();
            return Ok(output);
        }

        // POST: api/roombooking
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] RoomBookingInput newRoomBooking)
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
        public async Task<ActionResult> Put(int id, [FromBody] RoomBookingInput newRoomBooking)
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
