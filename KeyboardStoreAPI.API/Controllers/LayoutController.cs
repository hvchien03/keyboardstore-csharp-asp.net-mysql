using KeyboardStoreAPI.API.DTOs.Layout;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LayoutController : ControllerBase
    {
        private readonly ILayoutService _layoutService;

        public LayoutController(ILayoutService layoutService)
        {
            _layoutService = layoutService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var layouts = await _layoutService.GetAllLayoutsAsync();
            return Ok(layouts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var layout = await _layoutService.GetLayoutByIdAsync(id);
            return Ok(layout);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateLayoutDto dto)
        {
            var layout = await _layoutService.CreateLayoutAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = layout.Id }, layout);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateLayoutDto dto)
        {
            var layout = await _layoutService.UpdateLayoutAsync(id, dto);
            return Ok(layout);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _layoutService.DeleteLayoutAsync(id);
            return NoContent();
        }
    }
}
