using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Repositories.Interfaces
{
    /// <summary>
    /// Interface định nghĩa các phương thức làm việc với RefreshToken trong database
    /// </summary>
    public interface IRefreshTokenRepository
    {
        /// <returns>RefreshToken object hoặc null nếu không tìm thấy</returns>
        Task<RefreshToken?> GetByTokenAsync(string token);
        
        Task<RefreshToken> CreateAsync(RefreshToken refreshToken);
        
        /// <summary>
        /// Thu hồi (vô hiệu hóa) một Refresh Token
        /// Đánh dấu IsRevoked = true
        /// </summary>
        /// <param name="token">Chuỗi token cần thu hồi</param>
        /// <returns>true nếu thành công, false nếu không tìm thấy token</returns>
        Task<bool> RevokeAsync(string token);
        
        /// <summary>
        /// Thu hồi TẤT CẢ Refresh Token của một user
        /// Dùng khi user đổi mật khẩu hoặc logout khỏi tất cả thiết bị
        /// </summary>
        /// <param name="userId">ID của user</param>
        /// <returns>Số lượng token đã thu hồi</returns>
        Task<int> RevokeAllByUserIdAsync(int userId);
        
        /// <summary>
        /// Xóa các Refresh Token đã hết hạn (cleanup)
        /// Chạy định kỳ để giữ database sạch
        /// </summary>
        /// <returns>Số lượng token đã xóa</returns>
        Task<int> DeleteExpiredTokensAsync();
    }
}