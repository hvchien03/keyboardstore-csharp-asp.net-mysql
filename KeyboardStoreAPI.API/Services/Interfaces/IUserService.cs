using KeyboardStoreAPI.API.DTOs.User;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> GetMyProfileAsync(int userId);
        Task<UserDto> UpdateMyProfileAsync(int userId, UpdateMyProfileDto dto);
        Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> UpdateUserRoleAsync(int id, UpdateUserRoleDto dto);
    }
}
