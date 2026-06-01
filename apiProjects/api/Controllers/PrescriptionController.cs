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
        public async Task<IEnumerable<PrescriptionOutput>> GetAllPrescriptions()
        {
            var output = await _PrescriptionService.GetAll();
            return output;
        }

        // GET api/<PrescriptionController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PrescriptionOutput>> Get(int id)
        {
            PrescriptionOutput output = await _PrescriptionService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<PrescriptionController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PrescriptionInput newPrescription)
        {
            int newId = await _PrescriptionService.CreatePrescription(newPrescription);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<PrescriptionController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] PrescriptionInput newPrescription)
        {
            bool output = await _PrescriptionService.EditPrescription(id, newPrescription);

            if (output)
                return Ok();
            else
                return NoContent();
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
