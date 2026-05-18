using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using KeyboardStoreAPI.API.Services.Interfaces;
using StackExchange.Redis;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _cache;
        private readonly IConnectionMultiplexer _redis;

        public CacheService(IDistributedCache cache, IConnectionMultiplexer redis)
        {
            _cache = cache;
            _redis = redis;
        }

        // Lấy data từ cache, deserialize từ JSON
        public async Task<T?> GetAsync<T>(string key)
        {
            var data = await _cache.GetStringAsync(key);
            
            if (string.IsNullOrEmpty(data))
                return default;
            
            return JsonSerializer.Deserialize<T>(data);
        }

        // Lưu data vào cache, serialize thành JSON
        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        {
            var options = new DistributedCacheEntryOptions();
            
            if (expiration.HasValue)
            {
                options.AbsoluteExpirationRelativeToNow = expiration;
            }
            else
            {
                options.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10); // Default 10 phút
            }

            var serializedData = JsonSerializer.Serialize(value);
            await _cache.SetStringAsync(key, serializedData, options);
        }

        // Xóa 1 key khỏi cache
        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }

        // Xóa nhiều key theo pattern (ví dụ: "product:*")
        public async Task RemoveByPatternAsync(string pattern)
        {
            var db = _redis.GetDatabase();
            var endpoints = _redis.GetEndPoints();
            var server = _redis.GetServer(endpoints.First());
            
            // Tìm tất cả key khớp pattern
            var keys = server.Keys(pattern: pattern).ToArray();
            
            // Xóa tất cả
            if (keys.Length > 0)
            {
                await db.KeyDeleteAsync(keys);
            }
        }
    }
}