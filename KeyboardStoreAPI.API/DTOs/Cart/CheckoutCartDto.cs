using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Cart
{
    public class CheckoutCartDto
    {
        [Required]
        [MaxLength(100)]
        public string ShippingName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string ShippingPhone { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Note { get; set; }
    }
}
