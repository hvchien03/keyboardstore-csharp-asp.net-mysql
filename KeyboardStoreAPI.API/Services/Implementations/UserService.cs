using KeyboardStoreAPI.API.DTOs.User;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class UserService : IUserService
    {
        private static readonly string[] ValidRoles = { "User", "Admin" };

        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserDto> GetMyProfileAsync(int userId)
        {
            var user = await GetUserAsync(userId);

            return MapToDto(user);
        }

        public async Task<UserDto> UpdateMyProfileAsync(int userId, UpdateMyProfileDto dto)
        {
            var user = await GetUserAsync(userId);
            var email = dto.Email.Trim();

            if (!string.Equals(user.Email, email, StringComparison.OrdinalIgnoreCase)
                && await _userRepository.ExistsByEmailAsync(email))
            {
                throw new BadRequestException("Email already exists");
            }

            user.Email = email;
            var updatedUser = await _userRepository.UpdateAsync(user);

            return MapToDto(updatedUser);
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await GetUserAsync(userId);

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            {
                throw new BadRequestException("Current password is incorrect");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _userRepository.UpdateAsync(user);
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(MapToDto);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await GetUserAsync(id);

            return MapToDto(user);
        }

        public async Task<UserDto> UpdateUserRoleAsync(int id, UpdateUserRoleDto dto)
        {
            if (!ValidRoles.Contains(dto.Role))
            {
                throw new BadRequestException($"Invalid role. Valid roles: {string.Join(", ", ValidRoles)}");
            }

            var user = await GetUserAsync(id);
            user.Role = dto.Role;

            var updatedUser = await _userRepository.UpdateAsync(user);

            return MapToDto(updatedUser);
        }

        private async Task<User> GetUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new NotFoundException($"User with ID {id} not found");
            }

            return user;
        }

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
