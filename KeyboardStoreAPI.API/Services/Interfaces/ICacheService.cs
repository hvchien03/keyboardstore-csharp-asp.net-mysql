namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface ICacheService
    {
        // Lấy data từ cache
        Task<T?> GetAsync<T>(string key);
        
        // Lưu data vào cache
        Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);
        
        // Xóa 1 key
        Task RemoveAsync(string key);
        
        // Xóa nhiều key theo pattern
        Task RemoveByPatternAsync(string pattern);
    }
}