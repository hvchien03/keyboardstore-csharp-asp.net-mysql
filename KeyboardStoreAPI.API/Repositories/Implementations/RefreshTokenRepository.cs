using Microsoft.EntityFrameworkCore;
using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    /// <summary>
    /// Implementation của IRefreshTokenRepository
    /// Xử lý tất cả thao tác database liên quan đến RefreshToken
    /// </summary>
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        // _context = Database context để truy vấn database
        private readonly ApplicationDbContext _context;

        /// <summary>
        /// Constructor - Dependency Injection tự động inject ApplicationDbContext
        /// </summary>
        /// <param name="context">Database context</param>
        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Tìm Refresh Token theo chuỗi token
        /// Include(rt => rt.User) = JOIN với bảng Users để lấy luôn thông tin User
        /// </summary>
        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.User) // JOIN với bảng Users
                .FirstOrDefaultAsync(rt => rt.Token == token);
            
            // FirstOrDefaultAsync:
            // - Lấy phần tử ĐẦU TIÊN thỏa mãn điều kiện
            // - Trả về null nếu không tìm thấy
            // - async = chạy bất đồng bộ, không block thread
        }

        /// <summary>
        /// Tạo mới Refresh Token
        /// </summary>
        public async Task<RefreshToken> CreateAsync(RefreshToken refreshToken)
        {
            // Add vào DbSet (chưa lưu vào database)
            _context.RefreshTokens.Add(refreshToken);
            
            // SaveChangesAsync = Thực thi SQL INSERT vào database
            await _context.SaveChangesAsync();
            
            // Sau khi SaveChanges, refreshToken.Id sẽ có giá trị (auto-increment)
            return refreshToken;
        }

        /// <summary>
        /// Thu hồi một Refresh Token
        /// Đánh dấu IsRevoked = true, không xóa khỏi database (soft delete)
        /// </summary>
        public async Task<bool> RevokeAsync(string token)
        {
            // Tìm token trong database
            var refreshToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == token);
            
            // Nếu không tìm thấy, return false
            if (refreshToken == null) return false;

            // Đánh dấu đã thu hồi
            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            
            return true;
        }

        /// <summary>
        /// Thu hồi TẤT CẢ token của user (logout all devices)
        /// </summary>
        public async Task<int> RevokeAllByUserIdAsync(int userId)
        {
            // Lấy TẤT CẢ token của user và chưa bị thu hồi
            var tokens = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();
            
            // Đánh dấu tất cả là đã thu hồi
            foreach (var token in tokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
            }
            
            await _context.SaveChangesAsync();
            
            // Trả về số lượng token đã thu hồi
            return tokens.Count;
        }

        /// <summary>
        /// Xóa các token đã hết hạn (cleanup job)
        /// Nên chạy định kỳ (ví dụ: mỗi ngày 1 lần)
        /// </summary>
        public async Task<int> DeleteExpiredTokensAsync()
        {
            // Lấy tất cả token đã hết hạn
            var expiredTokens = await _context.RefreshTokens
                .Where(rt => rt.ExpiresAt < DateTime.UtcNow) // Hết hạn = ExpiresAt < Hiện tại
                .ToListAsync();
            
            _context.RefreshTokens.RemoveRange(expiredTokens);
            
            await _context.SaveChangesAsync();
            
            // Trả về số lượng đã xóa
            return expiredTokens.Count;
        }
    }
}