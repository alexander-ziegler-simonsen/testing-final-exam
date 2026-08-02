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
        [ProducesResponseType(typeof(DepartmentOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IEnumerable<DepartmentOutputDto>> GetAllDepartments()
        {
            var output = await _DepartmentService.GetAll();

            return output;
        }

        // GET api/<DepartmentController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DepartmentOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<DepartmentOutputDto>> Get(int id)
        {
            DepartmentOutputDto output = await _DepartmentService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<DepartmentController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DepartmentInputDto newDepartment)
        {
            int newId = await _DepartmentService.CreateDepartment(newDepartment);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<DepartmentController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] DepartmentInputDto newDepartment)
        {
            bool output = await _DepartmentService.EditDepartment(id, newDepartment);

            if (output)
                return Ok();
            else
                return NotFound();
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