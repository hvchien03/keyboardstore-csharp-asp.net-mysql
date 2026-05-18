using KeyboardStoreAPI.API.DTOs.Cart;
using KeyboardStoreAPI.API.DTOs.Order;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetCartAsync(int userId);
        Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto);
        Task<CartDto> UpdateItemAsync(int userId, int productId, UpdateCartItemDto dto);
        Task<bool> RemoveItemAsync(int userId, int productId);
        Task ClearCartAsync(int userId);
        Task<OrderDto> CheckoutAsync(int userId, CheckoutCartDto dto);
    }
}
