using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Auth
{
    public class ResendVerificationEmailDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
