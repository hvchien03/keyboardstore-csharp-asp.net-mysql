using System.Security.Claims;
using KeyboardStoreAPI.API.DTOs.Cart;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _cartService.GetCartAsync(GetCurrentUserId());

            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem([FromBody] AddCartItemDto dto)
        {
            var cart = await _cartService.AddItemAsync(GetCurrentUserId(), dto);

            return Ok(cart);
        }

        [HttpPut("items/{productId}")]
        public async Task<IActionResult> UpdateItem(int productId, [FromBody] UpdateCartItemDto dto)
        {
            var cart = await _cartService.UpdateItemAsync(GetCurrentUserId(), productId, dto);

            return Ok(cart);
        }

        [HttpDelete("items/{productId}")]
        public async Task<IActionResult> RemoveItem(int productId)
        {
            await _cartService.RemoveItemAsync(GetCurrentUserId(), productId);

            return NoContent();
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            await _cartService.ClearCartAsync(GetCurrentUserId());

            return NoContent();
        }

        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] CheckoutCartDto dto)
        {
            var order = await _cartService.CheckoutAsync(GetCurrentUserId(), dto);

            return CreatedAtAction("GetOrderById", "Order", new { id = order.Id }, order);
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
