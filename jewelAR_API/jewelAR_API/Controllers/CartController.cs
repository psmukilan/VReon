using jewelAR_API.Models;
using jewelAR_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace jewelAR_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService) =>
            _cartService = cartService;

        [HttpGet]
        public async Task<List<Cart>> Get() =>
            await _cartService.GetAsync();

        [HttpGet("GetAllJewelsForUser")]
        public async Task<List<Cart>> GetAllJewelsForUser([FromQuery] string userEmailId) =>
            await _cartService.GetAllJewelsForUserAsync(userEmailId);

        [HttpPost]
        public async Task<IActionResult> Post(Cart newCart)
        {
            await _cartService.CreateAsync(newCart);
            return CreatedAtAction(nameof(Get), new { id = newCart.Id }, newCart);
        }
    }
}
