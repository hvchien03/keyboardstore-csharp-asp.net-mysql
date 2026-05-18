using Microsoft.AspNetCore.Mvc;
using KeyboardStoreAPI.API.DTOs.Auth;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(result);
        }

        // THÊM MỚI: Endpoint refresh token
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto dto)
        {
            var result = await _authService.RefreshTokenAsync(dto.RefreshToken);
            return Ok(result);
        }

        // THÊM MỚI: Endpoint logout (revoke token)
        [HttpPost("logout")]
        [Authorize] // Yêu cầu phải có Access Token
        public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto dto)
        {
            var result = await _authService.RevokeTokenAsync(dto.RefreshToken);
            if (!result)
            {
                return BadRequest(new { message = "Invalid refresh token" });
            }
            return Ok(new { message = "Logged out successfully" });
        }
    }
}