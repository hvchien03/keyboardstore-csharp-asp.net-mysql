namespace KeyboardStoreAPI.API.DTOs.Payment
{
    public class PaymentResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
    }
}