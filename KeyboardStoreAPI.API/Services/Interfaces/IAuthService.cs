using KeyboardStoreAPI.API.DTOs.Auth;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);

        // THÊM MỚI: Phương thức refresh token
        Task<AuthResponseDto> RefreshTokenAsync(string refreshToken);
        
        // THÊM MỚI: Thu hồi refresh token (logout)
        Task<bool> RevokeTokenAsync(string refreshToken);
    }
}