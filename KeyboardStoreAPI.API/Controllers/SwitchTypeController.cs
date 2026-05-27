using KeyboardStoreAPI.API.DTOs.SwitchType;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SwitchTypeController : ControllerBase
    {
        private readonly ISwitchTypeService _switchTypeService;

        public SwitchTypeController(ISwitchTypeService switchTypeService)
        {
            _switchTypeService = switchTypeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var switchTypes = await _switchTypeService.GetAllSwitchTypesAsync();
            return Ok(switchTypes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var switchType = await _switchTypeService.GetSwitchTypeByIdAsync(id);
            return Ok(switchType);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateSwitchTypeDto dto)
        {
            var switchType = await _switchTypeService.CreateSwitchTypeAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = switchType.Id }, switchType);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSwitchTypeDto dto)
        {
            var switchType = await _switchTypeService.UpdateSwitchTypeAsync(id, dto);
            return Ok(switchType);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _switchTypeService.DeleteSwitchTypeAsync(id);
            return NoContent();
        }
    }
}
