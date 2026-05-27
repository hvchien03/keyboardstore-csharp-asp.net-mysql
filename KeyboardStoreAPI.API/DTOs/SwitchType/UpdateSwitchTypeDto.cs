using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.SwitchType
{
    public class UpdateSwitchTypeDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
