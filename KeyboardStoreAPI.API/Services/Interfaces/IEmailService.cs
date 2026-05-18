namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendWelcomeEmailAsync(string toEmail);
        Task SendOrderConfirmationEmailAsync(int orderId, string toEmail);
        Task SendPaymentSuccessEmailAsync(int orderId, string toEmail);
        Task SendOrderStatusUpdateEmailAsync(int orderId, string toEmail, string newStatus);
    }
}