using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Brand
{
    public class CreateBrandDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}
