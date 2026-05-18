using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Order
{
    public class CreateOrderDto
    {
        [MaxLength(100)]
        public string ShippingName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string ShippingPhone { get; set; } = string.Empty;

        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Note { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Order must have at least 1 item")]
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

    public class OrderItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }
    }
}
