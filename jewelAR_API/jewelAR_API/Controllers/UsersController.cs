using jewelAR_API.Models;
using jewelAR_API.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace jewelAR_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UsersService _usersService;

        public UsersController(UsersService usersService) =>
            _usersService = usersService;

        [HttpGet]
        public async Task<List<User>> Get() =>
            await _usersService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            await _usersService.CreateAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser.Id }, newUser);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, User updatedUser)
        {
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            updatedUser.Id = user.Id;

            await _usersService.UpdateAsync(id, updatedUser);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _usersService.GetAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _usersService.RemoveAsync(id);

            return NoContent();
        }

        [HttpPost("ValidateUser")]
        public async Task<User?> ValidateUser([FromBody] UserCredentials userCredentials)
        {
            var user = await _usersService.ValidateUserAsync(userCredentials.Email, userCredentials.Password);
            if(user != null)
            {
                return user;
            }
            else
            {
                return null;
            }
        }

        [HttpGet("GetDefaultUser")]
        public async Task<User> GetDefaultUser()
        {
            return await _usersService.GetDefaultUserAsync();
        }
    }
}
