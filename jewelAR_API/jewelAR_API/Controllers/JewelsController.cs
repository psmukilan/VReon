using jewelAR_API.Models;
using jewelAR_API.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace jewelAR_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JewelsController : ControllerBase
    {
        private readonly JewelsService _jewelsService;

        public JewelsController(JewelsService jewelsService) =>
            _jewelsService = jewelsService;

        [HttpGet]
        public async Task<List<Jewel>> Get() =>
            await _jewelsService.GetAsync();

        [HttpGet("GetAllJewelsForJewellerId")]
        public async Task<List<Jewel>> GetAllJewelsForJewellerId([FromQuery] string jewellerId) =>
            await _jewelsService.GetAllJewelsForJewellerIdAsync(jewellerId);

        [HttpGet("GetAllJewelsForJewellerIdWithPagination")]
        public async Task<List<Jewel>> GetAllJewelsForJewellerIdWithPagination([FromQuery] string jewellerId, [FromQuery] int pageNumber) =>
            await _jewelsService.GetAllJewelsForJewellerIdWithPaginationAsync(jewellerId, pageNumber);

        [HttpGet("GetAllJewelCategoriesForJewellerId")]
        public async Task<List<string>> GetAllJewelCategoriesForJewellerId([FromQuery] string jewellerId) =>
            await _jewelsService.GetAllJewelCategoriesForJewellerIdAsync(jewellerId);

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Jewel>> Get(string id)
        {
            var jewel = await _jewelsService.GetAsync(id);

            if (jewel is null)
            {
                return NotFound();
            }

            return jewel;
        }

        [HttpGet("GetJewelsByCategory/{category}")]
        public async Task<ActionResult<List<Jewel>>> GetJewelsByCategory(string category, [FromQuery] string jewellerId)
        {
            var jewel = await _jewelsService.GetByCategoryAsync(category, jewellerId);
            return jewel;
        }

        [HttpGet("GetJewelsByCategoryWithPagination/{category}")]
        public async Task<ActionResult<List<Jewel>>> GetJewelsByCategoryWithPagination(string category, [FromQuery] string jewellerId, [FromQuery] int pageNumber)
        {
            var jewel = await _jewelsService.GetByCategoryWithPaginationAsync(category, jewellerId, pageNumber);
            return jewel;
        }

        [HttpGet("GetJewelsByCategories/{category}")]
        public async Task<ActionResult<List<Jewel>>> GetJewelsByCategories(string category, [FromQuery] string jewellerId)
        {
            var categories = category.Split(',');
            var jewel = await _jewelsService.GetByCategoriesAsync(categories, jewellerId);
            return jewel;
        }

        [HttpGet("GetJewelsByCategoriesWithPagination/{category}")]
        public async Task<ActionResult<List<Jewel>>> GetJewelsByCategoriesWithPagination(string category, [FromQuery] string jewellerId, [FromQuery] int pageNumber)
        {
            var categories = category.Split(',');
            var jewel = await _jewelsService.GetByCategoriesWithPaginationAsync(categories, jewellerId, pageNumber);
            return jewel;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Jewel newJewel)
        {
            await _jewelsService.CreateAsync(newJewel);
            return CreatedAtAction(nameof(Get), new { id = newJewel.Id }, newJewel);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, Jewel updatedJewel)
        {
            var jewel = await _jewelsService.GetAsync(id);

            if (jewel is null)
            {
                return NotFound();
            }

            updatedJewel.Id = jewel.Id;

            await _jewelsService.UpdateAsync(id, updatedJewel);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var jewel = await _jewelsService.GetAsync(id);

            if (jewel is null)
            {
                return NotFound();
            }

            await _jewelsService.RemoveAsync(id);

            return NoContent();
        }
    }
}
