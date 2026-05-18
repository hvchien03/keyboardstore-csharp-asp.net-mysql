using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.User
{
    public class UpdateUserRoleDto
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
