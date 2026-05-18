using System.ComponentModel.DataAnnotations;
using KeyboardStoreAPI.API.DTOs.Order;

namespace KeyboardStoreAPI.API.DTOs.Payment
{
    public class CreatePaymentRequestDto
    {
        [Required]
        public CreateOrderDto OrderDto { get; set; } = null!;
    }
}
