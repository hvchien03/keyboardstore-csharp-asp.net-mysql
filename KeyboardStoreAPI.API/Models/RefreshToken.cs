namespace KeyboardStoreAPI.API.Models
{
    public class RefreshToken
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        

        public string Token { get; set; } = string.Empty;
        
        /// <summary>
        /// Thời điểm token hết hạn
        /// Ví dụ: DateTime.UtcNow.AddDays(7) = hết hạn sau 7 ngày
        /// </summary>
        public DateTime ExpiresAt { get; set; }
        
        /// <summary>
        /// Thời điểm token được tạo
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        /// <summary>
        /// Token này đã bị thu hồi chưa?
        /// true = đã thu hồi (logout), false = còn hiệu lực
        /// </summary>
        public bool IsRevoked { get; set; } = false;
        
        /// <summary>
        /// Thời điểm token bị thu hồi (nếu có)
        /// </summary>
        public DateTime? RevokedAt { get; set; }
        
        // Navigation Property - Liên kết với User
        /// <summary>
        /// User sở hữu token này
        /// EF Core tự động join với bảng Users qua UserId
        /// </summary>
        public User User { get; set; } = null!;
    }
}