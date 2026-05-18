using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId);
        Task<CartItem?> GetByUserAndProductAsync(int userId, int productId);
        Task<CartItem> AddAsync(CartItem cartItem);
        Task<CartItem> UpdateAsync(CartItem cartItem);
        Task<bool> RemoveAsync(int userId, int productId);
        Task ClearAsync(int userId);
    }
}
