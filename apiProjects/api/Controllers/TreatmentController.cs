using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TreatmentController : ControllerBase
    {
        private ITreatmentService _TreatmentService;

        public TreatmentController (ITreatmentService TreatmentService) {
            _TreatmentService = TreatmentService;
        }


        // GET: api/<TreatmentController>
        [HttpGet]
        public async Task<IEnumerable<TreatmentOutput>> GetAllTreatments()
        {
            var output = await _TreatmentService.GetAll();

            return output;
        }

        // GET api/<TreatmentController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TreatmentOutput>> Get(int id)
        {
            TreatmentOutput output = await _TreatmentService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<TreatmentController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] TreatmentInput newTreatment)
        {
            int newId = await _TreatmentService.CreateTreatment(newTreatment);
            return Ok(newId);
        }

        // PUT api/<TreatmentController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TreatmentInput newTreatment)
        {
            bool output = await _TreatmentService.EditTreatment(id, newTreatment);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<TreatmentController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _TreatmentService.DeleteTreatment(id);

            if (output)
                return Ok();
            else
                return NoContent();
        }
    }

}