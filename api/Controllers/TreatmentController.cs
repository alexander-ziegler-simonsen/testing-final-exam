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
    public class TreatmentController : ControllerBase
    {
        private ITreatmentService _TreatmentService;

        public TreatmentController(ITreatmentService TreatmentService)
        {
            _TreatmentService = TreatmentService;
        }


        // GET: api/<TreatmentController>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<TreatmentOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<TreatmentOutputDto>> GetAllTreatments(
            [FromQuery] TreatmentInputDto? filter = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] string? sortDir = "asc")
        {
            return await _TreatmentService.GetAll(filter, sortBy, sortDir);
        }

        // GET api/<TreatmentController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(TreatmentOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TreatmentOutputDto>> Get(int id)
        {
            TreatmentOutputDto output = await _TreatmentService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<TreatmentController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult> Post([FromBody] TreatmentInputDto newTreatment, [FromQuery] int? staffId = null)
        {
            int newId = await _TreatmentService.CreateTreatment(newTreatment, staffId);
            return Ok(newId);
        }

        // PUT api/<TreatmentController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TreatmentInputDto newTreatment)
        {
            bool output = await _TreatmentService.EditTreatment(id, newTreatment);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<TreatmentController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _TreatmentService.DeleteTreatment(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }

}