namespace KeyboardStoreAPI.API.DTOs.Auth
{
    /// <summary>
    /// DTO nhận từ client khi muốn làm mới Access Token
    /// Client gửi Refresh Token cũ, server trả về Access Token mới
    /// </summary>
    public class RefreshTokenRequestDto
    {
        /// <summary>
        /// Refresh Token mà user nhận được khi login
        /// Ví dụ: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        /// </summary>
        public string RefreshToken { get; set; } = string.Empty;
    }
}