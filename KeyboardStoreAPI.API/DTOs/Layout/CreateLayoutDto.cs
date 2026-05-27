using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Layout
{
    public class CreateLayoutDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Percentage { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
