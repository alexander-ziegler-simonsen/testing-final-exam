using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private IDepartmentService _DepartmentService;

        public DepartmentController(IDepartmentService DepartmentService)
        {
            _DepartmentService = DepartmentService;
        }


        // GET: api/<DepartmentController>
        [HttpGet]
        public async Task<IEnumerable<DepartmentOutput>> GetAllDepartments()
        {
            var output = await _DepartmentService.GetAll();

            return output;
        }

        // GET api/<DepartmentController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentOutput>> Get(int id)
        {
            DepartmentOutput output = await _DepartmentService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<DepartmentController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DepartmentInput newDepartment)
        {
            int newId = await _DepartmentService.CreateDepartment(newDepartment);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<DepartmentController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DepartmentInput newDepartment)
        {
            bool output = await _DepartmentService.EditDepartment(id, newDepartment);

            if (output)
                return Ok();
            else
                return NoContent();
        }

        // DELETE api/<DepartmentController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _DepartmentService.DeleteDepartment(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }

}