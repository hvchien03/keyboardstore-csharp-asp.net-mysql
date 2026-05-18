namespace KeyboardStoreAPI.API.Models
{
    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Details { get; set; } // Stack trace (chỉ show trong Development)
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? Path { get; set; } // API endpoint bị lỗi
    }
}