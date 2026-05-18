using KeyboardStoreAPI.API.DTOs.Order;
using KeyboardStoreAPI.API.Constants;
using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto dto, string paymentMethod = PaymentMethods.COD);
        Task<OrderDto> GetOrderByIdAsync(int orderId, int userId);
        Task<OrderDto> GetOrderByIdForAdminAsync(int orderId);
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<PagedResult<OrderDto>> GetOrdersPagedAsync(OrderFilterParams filterParams);
        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);
        Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status);
    }
}
