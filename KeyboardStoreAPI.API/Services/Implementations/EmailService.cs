using MailKit.Net.Smtp;
using MimeKit;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<EmailService> _logger;

        public EmailService(
            IConfiguration configuration,
            IOrderRepository orderRepository,
            ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _orderRepository = orderRepository;
            _logger = logger;
        }

        public async Task SendWelcomeEmailAsync(string toEmail)
        {
            var template = await File.ReadAllTextAsync("Templates/Email/WelcomeEmail.html");
            var body = template
                .Replace("{{UserEmail}}", toEmail)
                .Replace("{{SiteUrl}}", "http://localhost:3000");

            await SendEmailAsync(toEmail, "Chào mừng đến Keyboard Store!", body);
        }

        public async Task SendOrderConfirmationEmailAsync(int orderId, string toEmail)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null) return;

            var template = await File.ReadAllTextAsync("Templates/Email/OrderConfirmation.html");

            var orderItemsHtml = string.Join("", order.OrderDetails.Select(od =>
                $"<tr><td>{od.Product.Name}</td><td>{od.Quantity}</td><td>{od.Price:N0} VNĐ</td></tr>"
            ));

            var body = template
                .Replace("{{OrderId}}", orderId.ToString())
                .Replace("{{UserEmail}}", toEmail)
                .Replace("{{OrderItems}}", orderItemsHtml)
                .Replace("{{TotalAmount}}", order.TotalAmount.ToString("N0"))
                .Replace("{{OrderStatus}}", order.Status)
                .Replace("{{PaymentMethod}}", order.PaymentMethod);

            await SendEmailAsync(toEmail, $"Xác nhận đơn hàng #{orderId}", body);
        }

        public async Task SendPaymentSuccessEmailAsync(int orderId, string toEmail)
        {
            await SendEmailAsync(
                toEmail,
                $"Thanh toán thành công - Đơn hàng #{orderId}",
                $"<p>Đơn hàng #{orderId} của bạn đã được thanh toán thành công!</p>"
            );
        }

        public async Task SendOrderStatusUpdateEmailAsync(int orderId, string toEmail, string newStatus)
        {
            await SendEmailAsync(
                toEmail,
                $"Cập nhật đơn hàng #{orderId}",
                $"<p>Đơn hàng #{orderId} của bạn đã chuyển sang trạng thái: <strong>{newStatus}</strong></p>"
            );
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");
                var senderName = GetRequiredEmailSetting(emailSettings, "SenderName");
                var senderEmail = GetRequiredEmailSetting(emailSettings, "SenderEmail");
                var smtpHost = GetRequiredEmailSetting(emailSettings, "SmtpHost");
                var smtpPort = int.Parse(GetRequiredEmailSetting(emailSettings, "SmtpPort"));
                var username = GetRequiredEmailSetting(emailSettings, "Username");
                var password = GetRequiredEmailSetting(emailSettings, "Password");

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(MailboxAddress.Parse(toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
                message.Body = bodyBuilder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    smtpHost,
                    smtpPort,
                    MailKit.Security.SecureSocketOptions.StartTls
                );

                await smtp.AuthenticateAsync(username, password);

                await smtp.SendAsync(message);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation("Email sent to {Email} with subject: {Subject}", toEmail, subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            }
        }

        private static string GetRequiredEmailSetting(IConfigurationSection section, string key)
        {
            var value = section[key];

            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"Email setting '{key}' is missing");
            }

            return value;
        }
    }
}
