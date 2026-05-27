using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Product
{
    public class CreateProductImageDto
    {
        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        [MaxLength(200)]
        public string Alt { get; set; } = string.Empty;

        public int DisplayOrder { get; set; }
    }
}
