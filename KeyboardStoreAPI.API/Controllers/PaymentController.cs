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
        private const string FrontendPaymentSuccessUrl = "http://localhost:3000/payment/success";
        private const string FrontendPaymentFailedUrl = "http://localhost:3000/payment/failed";

        private readonly IPaymentService _paymentService;
        private readonly IOrderService _orderService;

        public PaymentController(
            IPaymentService paymentService,
            IOrderService orderService)
        {
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
            var baseUrl = response.Success ? FrontendPaymentSuccessUrl : FrontendPaymentFailedUrl;

            return Redirect($"{baseUrl}?orderId={response.OrderId}");
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
    }
}
