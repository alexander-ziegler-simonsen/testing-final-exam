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
    public class DepartmentStaffController : ControllerBase
    {
        private IDepartmentStaffService _departmentStaffService;

        public DepartmentStaffController(IDepartmentStaffService departmentStaffService)
        {
            _departmentStaffService = departmentStaffService;
        }

        // GET: api/<DepartmentStaffController>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<DepartmentStaffOutputDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<DepartmentStaffOutputDto>> GetAll()
        {
            return await _departmentStaffService.GetAll();
        }

        // GET api/<DepartmentStaffController>/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(DepartmentStaffOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DepartmentStaffOutputDto>> Get(int id)
        {
            DepartmentStaffOutputDto output = await _departmentStaffService.GetOne(id);
            if (output == null)
                return NotFound();
            else
                return Ok(output);
        }

        // POST api/<DepartmentStaffController>
        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<int>> Post([FromBody] DepartmentStaffInputDto input)
        {
            int newId = await _departmentStaffService.CreateDepartmentStaff(input);

            if (newId > 0)
                return Ok(newId);
            else
                return NoContent();
        }

        // PUT api/<DepartmentStaffController>/5
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Put(int id, [FromBody] DepartmentStaffInputDto input)
        {
            bool output = await _departmentStaffService.EditDepartmentStaff(id, input);

            if (output)
                return Ok();
            else
                return NotFound();
        }

        // DELETE api/<DepartmentStaffController>/5
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(int id)
        {
            bool output = await _departmentStaffService.DeleteDepartmentStaff(id);

            if (output)
                return NoContent();
            else
                return NotFound();
        }
    }
}
