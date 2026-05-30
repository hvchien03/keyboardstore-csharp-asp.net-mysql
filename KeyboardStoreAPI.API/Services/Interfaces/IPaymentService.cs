using KeyboardStoreAPI.API.DTOs.Payment;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IPaymentService
    {
        string CreateVNPayPaymentUrl(int orderId, decimal amount, string orderInfo);
        Task<PaymentResponseDto> ProcessVNPayReturn(IQueryCollection queryCollection);
        Task ClearPaidOrderItemsFromCartAsync(int orderId, int userId);
    }
}
