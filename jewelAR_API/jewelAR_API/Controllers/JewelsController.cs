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
        public async Task<ActionResult<List<Jewel>>> GetJewelsByCategory(string category)
        {
            var jewel = await _jewelsService.GetByCategoryAsync(category);
            return jewel;
        }

        [HttpGet("GetJewelsByCategories/{category}")]
        public async Task<ActionResult<List<Jewel>>> GetJewelsByCategories(string category)
        {
            var categories = category.Split(',');
            var jewel = await _jewelsService.GetByCategoriesAsync(categories);
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
