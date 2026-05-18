using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Product
{
    public class UpdateProductDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Url]
        public string? ImageUrl { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }
}