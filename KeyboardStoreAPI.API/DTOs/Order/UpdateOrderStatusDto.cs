using System.ComponentModel.DataAnnotations;

namespace KeyboardStoreAPI.API.DTOs.Order
{
    public class UpdateOrderStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
    }
}
