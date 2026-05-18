namespace KeyboardStoreAPI.API.DTOs.Order
{
    public class OrderDetailDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; } // Giá tại thời điểm đặt
        public decimal Subtotal { get; set; } // = Price * Quantity
    }
}