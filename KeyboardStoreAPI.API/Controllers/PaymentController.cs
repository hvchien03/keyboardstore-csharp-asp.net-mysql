using System.Security.Claims;
using KeyboardStoreAPI.API.Constants;
using KeyboardStoreAPI.API.DTOs.Payment;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IPaymentService _paymentService;
        private readonly IOrderService _orderService;

        public PaymentController(
            IConfiguration configuration,
            IPaymentService paymentService,
            IOrderService orderService)
        {
            _configuration = configuration;
            _paymentService = paymentService;
            _orderService = orderService;
        }

        [HttpPost("create-vnpay-payment")]
        [Authorize]
        public async Task<IActionResult> CreateVNPayPayment([FromBody] CreatePaymentRequestDto request)
        {
            var userId = GetCurrentUserId();
            var order = await _orderService.CreateOrderAsync(userId, request.OrderDto, PaymentMethods.VNPay);
            var paymentUrl = _paymentService.CreateVNPayPaymentUrl(
                order.Id,
                order.TotalAmount,
                $"Thanh toan don hang #{order.Id}");

            return Ok(new
            {
                orderId = order.Id,
                paymentUrl
            });
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VNPayReturn()
        {
            var response = await _paymentService.ProcessVNPayReturn(Request.Query);
            var frontendBaseUrl = GetRequiredSetting("AppSettings:FrontendBaseUrl").TrimEnd('/');
            var paymentPath = response.Success ? "/payment/success" : "/payment/failed";

            return Redirect($"{frontendBaseUrl}{paymentPath}?orderId={response.OrderId}");
        }

        [HttpGet("vnpay-ipn")]
        public async Task<IActionResult> VNPayIpn()
        {
            var response = await _paymentService.ProcessVNPayReturn(Request.Query);

            return Ok(new
            {
                RspCode = "00",
                Message = response.Message,
                response.OrderId,
                response.TransactionId
            });
        }

        [HttpGet("check-payment-status/{orderId}")]
        [Authorize]
        public async Task<IActionResult> CheckPaymentStatus(int orderId)
        {
            var userId = GetCurrentUserId();
            var order = await _orderService.GetOrderByIdAsync(orderId, userId);
            await _paymentService.ClearPaidOrderItemsFromCartAsync(orderId, userId);

            return Ok(new
            {
                orderId = order.Id,
                order.PaymentStatus,
                order.TransactionId,
                order.PaidAt
            });
        }

        private int GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }

            return int.Parse(userId);
        }

        private string GetRequiredSetting(string key)
        {
            var value = _configuration[key];

            if (string.IsNullOrWhiteSpace(value))
            {
                throw new InvalidOperationException($"Configuration value '{key}' is missing");
            }

            return value;
        }
    }
}
