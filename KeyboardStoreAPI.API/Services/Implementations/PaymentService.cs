using KeyboardStoreAPI.API.Constants;
using KeyboardStoreAPI.API.DTOs.Payment;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;
using KeyboardStoreAPI.API.Services.Payment;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private const string VNPaySuccessCode = "00";

        private readonly IConfiguration _configuration;
        private readonly IOrderRepository _orderRepository;
        private readonly ILogger<PaymentService> _logger;
        private readonly IEmailService _emailService;

        public PaymentService(
            IConfiguration configuration,
            IOrderRepository orderRepository,
            ILogger<PaymentService> logger,
            IEmailService emailService)
        {
            _configuration = configuration;
            _orderRepository = orderRepository;
            _logger = logger;
            _emailService = emailService;
        }

        public string CreateVNPayPaymentUrl(int orderId, decimal amount, string orderInfo)
        {
            ValidateWholeVNPayAmount(amount);

            var vnpay = new VNPayLibrary();
            var vnpaySettings = _configuration.GetSection("VNPaySettings");
            var version = GetRequiredSetting(vnpaySettings, "Version");
            var command = GetRequiredSetting(vnpaySettings, "Command");
            var tmnCode = GetRequiredSetting(vnpaySettings, "TmnCode");
            var currencyCode = GetRequiredSetting(vnpaySettings, "CurrencyCode");
            var locale = GetRequiredSetting(vnpaySettings, "Locale");
            var returnUrl = GetRequiredSetting(vnpaySettings, "ReturnUrl");
            var baseUrl = GetRequiredSetting(vnpaySettings, "BaseUrl");
            var hashSecret = GetRequiredSetting(vnpaySettings, "HashSecret");

            vnpay.AddRequestData("vnp_Version", version);
            vnpay.AddRequestData("vnp_Command", command);
            vnpay.AddRequestData("vnp_TmnCode", tmnCode);
            vnpay.AddRequestData("vnp_Amount", ConvertToVNPayAmount(amount));
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", currencyCode);
            vnpay.AddRequestData("vnp_IpAddr", "127.0.0.1");
            vnpay.AddRequestData("vnp_Locale", locale);
            vnpay.AddRequestData("vnp_OrderInfo", orderInfo);
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", returnUrl);
            vnpay.AddRequestData("vnp_TxnRef", orderId.ToString());

            var paymentUrl = vnpay.CreateRequestUrl(
                baseUrl,
                hashSecret);

            _logger.LogInformation("Created VNPay payment URL for order {OrderId}", orderId);

            return paymentUrl;
        }

        public async Task<PaymentResponseDto> ProcessVNPayReturn(IQueryCollection queryCollection)
        {
            var vnpay = BuildVNPayResponse(queryCollection);
            var vnpaySettings = _configuration.GetSection("VNPaySettings");
            var secureHash = queryCollection["vnp_SecureHash"].ToString();
            var hashSecret = GetRequiredSetting(vnpaySettings, "HashSecret");

            if (!vnpay.ValidateSignature(secureHash, hashSecret))
            {
                _logger.LogWarning("Invalid VNPay signature");
                throw new BadRequestException("Invalid signature");
            }

            var orderId = int.Parse(vnpay.GetResponseData("vnp_TxnRef"));
            var transactionId = vnpay.GetResponseData("vnp_TransactionNo");
            var responseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var amount = ConvertFromVNPayAmount(vnpay.GetResponseData("vnp_Amount"));
            var order = await GetOrderAsync(orderId);

            if (amount != order.TotalAmount)
            {
                _logger.LogWarning(
                    "VNPay amount mismatch for order {OrderId}. Expected: {ExpectedAmount}, Actual: {ActualAmount}",
                    orderId,
                    order.TotalAmount,
                    amount);

                throw new BadRequestException("Payment amount does not match order total");
            }

            if (responseCode == VNPaySuccessCode)
            {
                if (order.PaymentStatus == PaymentStatuses.Paid)
                {
                    return new PaymentResponseDto
                    {
                        Success = true,
                        Message = "Payment already processed",
                        TransactionId = order.TransactionId ?? transactionId,
                        OrderId = order.Id,
                        Amount = amount
                    };
                }

                return await MarkPaymentAsPaidAsync(order, transactionId, amount);
            }

            return await MarkPaymentAsFailedAsync(order, amount, responseCode);
        }

        private static VNPayLibrary BuildVNPayResponse(IQueryCollection queryCollection)
        {
            var vnpay = new VNPayLibrary();

            foreach (var (key, value) in queryCollection)
            {
                if (!string.IsNullOrWhiteSpace(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            return vnpay;
        }

        private async Task<Order> GetOrderAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new NotFoundException($"Order {orderId} not found");
            }

            return order;
        }

        private async Task<PaymentResponseDto> MarkPaymentAsPaidAsync(
            Order order,
            string transactionId,
            decimal amount)
        {
            order.PaymentStatus = PaymentStatuses.Paid;
            order.TransactionId = transactionId;
            order.PaidAt = DateTime.UtcNow;
            order.Status = OrderStatuses.Processing;

            await _orderRepository.UpdateAsync(order);

            _logger.LogInformation(
                "Order {OrderId} paid successfully. Transaction: {TransactionId}",
                order.Id,
                transactionId);

            await _emailService.SendPaymentSuccessEmailAsync(order.Id, order.User.Email);

            return new PaymentResponseDto
            {
                Success = true,
                Message = "Payment successful",
                TransactionId = transactionId,
                OrderId = order.Id,
                Amount = amount
            };
        }

        private async Task<PaymentResponseDto> MarkPaymentAsFailedAsync(
            Order order,
            decimal amount,
            string responseCode)
        {
            order.PaymentStatus = PaymentStatuses.Failed;
            await _orderRepository.UpdateAsync(order);

            _logger.LogWarning(
                "Order {OrderId} payment failed. Code: {Code}",
                order.Id,
                responseCode);

            return new PaymentResponseDto
            {
                Success = false,
                Message = "Payment failed",
                OrderId = order.Id,
                Amount = amount
            };
        }

        private static string ConvertToVNPayAmount(decimal amount)
        {
            return ((long)(amount * 100)).ToString();
        }

        private static decimal ConvertFromVNPayAmount(string amount)
        {
            return decimal.Parse(amount) / 100;
        }

        private static string GetRequiredSetting(IConfigurationSection section, string key)
        {
            var value = section[key];

            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"VNPay setting '{key}' is missing");
            }

            return value;
        }

        private static void ValidateWholeVNPayAmount(decimal amount)
        {
            if (amount % 1 != 0)
            {
                throw new BadRequestException("VNPay only supports whole VND amounts");
            }
        }
    }
}
