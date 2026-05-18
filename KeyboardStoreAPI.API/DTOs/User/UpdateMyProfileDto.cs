using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.User
{
    public class UpdateMyProfileDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
    }
}
