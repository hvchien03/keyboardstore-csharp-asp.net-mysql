namespace KeyboardStoreAPI.API.DTOs.Auth
{
    public class AuthResponseDto
    {
        /// <summary>
        /// JWT Access Token - Dùng để gọi API
        /// Thời gian sống ngắn (15-60 phút)
        /// </summary>
        public string Token { get; set; } = string.Empty;
        /// <summary>
        /// THÊM MỚI: Refresh Token - Dùng để lấy Access Token mới
        /// Thời gian sống dài (7-30 ngày)
        /// </summary>
        public string RefreshToken { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        /// <summary>
        /// Thời điểm Access Token hết hạn
        /// </summary>
        public DateTime ExpiresAt { get; set; }
    }
}