using hospitalApi.DTOs.Inputs;
using hospitalApi.DTOs.Outputs;
using hospitalApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace hospitalApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET: api/user
        [HttpGet]
        [ProducesResponseType(typeof(UserOutputDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IEnumerable<UserOutputDto>> GetAll()
        {
            return await _userService.GetAll();
        }

        // POST api/user/register
        [HttpPost("register")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<bool>> Register([FromBody] RegisterInputDto input)
        {
            bool success = await _userService.Register(input);
            if (success)
                return Ok(true);
            else
                // Returns Conflict when username already exists
                return Conflict("Username already taken.");
        }

        // PUT api/user/{id}/password
        [HttpPut("{id}/password")]
        public async Task<ActionResult> ChangePassword(int id, [FromBody] string newPassword)
        {
            bool success = await _userService.ChangePassword(id, newPassword);
            return success ? Ok() : NotFound();
        }

        // DELETE api/user/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            bool success = await _userService.Delete(id);
            return success ? Ok() : NotFound();
        }
    }
}
