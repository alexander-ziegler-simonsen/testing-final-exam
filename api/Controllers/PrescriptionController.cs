using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private IPrescriptionService _PrescriptionService;

        public PrescriptionController(IPrescriptionService PrescriptionService)
        {
            _PrescriptionService = PrescriptionService;
        }

        // GET: api/<PrescriptionController>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PrescriptionOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<PrescriptionOutputDto>> GetAllPrescriptions()
        {
            var output = await _PrescriptionService.GetAll();
            return output;
        }

        // GET api/<PrescriptionController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PrescriptionOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PrescriptionOutputDto>> Get(int id)
        {
            PrescriptionOutputDto output = await _PrescriptionService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<PrescriptionController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<int>> Post([FromBody] PrescriptionInputDto newPrescription)
        {
            int newId = await _PrescriptionService.CreatePrescription(newPrescription);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<PrescriptionController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PrescriptionInputDto newPrescription)
        {
            bool output = await _PrescriptionService.EditPrescription(id, newPrescription);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<PrescriptionController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _PrescriptionService.DeletePrescription(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }
}
