using KeyboardStoreAPI.API.DTOs.Brand;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _brandService.GetAllBrandsAsync();
            return Ok(brands);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var brand = await _brandService.GetBrandByIdAsync(id);
            return Ok(brand);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateBrandDto dto)
        {
            var brand = await _brandService.CreateBrandAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = brand.Id }, brand);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateBrandDto dto)
        {
            var brand = await _brandService.UpdateBrandAsync(id, dto);
            return Ok(brand);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _brandService.DeleteBrandAsync(id);
            return NoContent();
        }
    }
}
