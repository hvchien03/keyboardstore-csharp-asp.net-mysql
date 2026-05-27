using KeyboardStoreAPI.API.DTOs.Cart;
using KeyboardStoreAPI.API.DTOs.Order;
using KeyboardStoreAPI.API.Constants;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;
        private readonly IOrderService _orderService;

        public CartService(
            ICartRepository cartRepository,
            IProductRepository productRepository,
            IOrderService orderService)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _orderService = orderService;
        }

        public async Task<CartDto> GetCartAsync(int userId)
        {
            var cartItems = await _cartRepository.GetByUserIdAsync(userId);

            return MapToCartDto(cartItems);
        }

        public async Task<CartDto> AddItemAsync(int userId, AddCartItemDto dto)
        {
            var product = await GetProductAsync(dto.ProductId);
            var cartItem = await _cartRepository.GetByUserAndProductAsync(userId, dto.ProductId);
            var newQuantity = dto.Quantity + (cartItem?.Quantity ?? 0);

            ValidateStock(product, newQuantity);

            if (cartItem == null)
            {
                cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _cartRepository.AddAsync(cartItem);
            }
            else
            {
                cartItem.Quantity = newQuantity;
                cartItem.UpdatedAt = DateTime.UtcNow;

                await _cartRepository.UpdateAsync(cartItem);
            }

            return await GetCartAsync(userId);
        }

        public async Task<CartDto> UpdateItemAsync(int userId, int productId, UpdateCartItemDto dto)
        {
            var product = await GetProductAsync(productId);
            ValidateStock(product, dto.Quantity);

            var cartItem = await _cartRepository.GetByUserAndProductAsync(userId, productId);
            if (cartItem == null)
            {
                throw new NotFoundException("Cart item not found");
            }

            cartItem.Quantity = dto.Quantity;
            cartItem.UpdatedAt = DateTime.UtcNow;

            await _cartRepository.UpdateAsync(cartItem);

            return await GetCartAsync(userId);
        }

        public async Task<bool> RemoveItemAsync(int userId, int productId)
        {
            var removed = await _cartRepository.RemoveAsync(userId, productId);
            if (!removed)
            {
                throw new NotFoundException("Cart item not found");
            }

            return true;
        }

        public async Task ClearCartAsync(int userId)
        {
            await _cartRepository.ClearAsync(userId);
        }

        public async Task<OrderDto> CheckoutAsync(int userId, CheckoutCartDto dto)
        {
            var cartItems = (await _cartRepository.GetByUserIdAsync(userId)).ToList();
            if (!cartItems.Any())
            {
                throw new BadRequestException("Cart is empty");
            }

            var orderDto = new CreateOrderDto
            {
                ShippingName = dto.ShippingName,
                ShippingPhone = dto.ShippingPhone,
                ShippingAddress = dto.ShippingAddress,
                Note = dto.Note,
                Items = cartItems.Select(item => new OrderItemDto
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity
                }).ToList()
            };

            var order = await _orderService.CreateOrderAsync(userId, orderDto, PaymentMethods.COD);
            await _cartRepository.ClearAsync(userId);

            return order;
        }

        private async Task<Product> GetProductAsync(int productId)
        {
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
            {
                throw new NotFoundException($"Product with ID {productId} not found");
            }

            return product;
        }

        private static void ValidateStock(Product product, int quantity)
        {
            if (quantity > product.Stock)
            {
                throw new BadRequestException(
                    $"Product '{product.Name}' only has {product.Stock} in stock");
            }
        }

        private static CartDto MapToCartDto(IEnumerable<CartItem> cartItems)
        {
            var items = cartItems.Select(MapToCartItemDto).ToList();

            return new CartDto
            {
                Items = items,
                TotalItems = items.Sum(item => item.Quantity),
                TotalAmount = items.Sum(item => item.Subtotal)
            };
        }

        private static CartItemDto MapToCartItemDto(CartItem cartItem)
        {
            return new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product?.Name ?? "Unknown",
                ImageUrl = cartItem.Product?.ProductImages
                    .OrderBy(image => image.DisplayOrder)
                    .FirstOrDefault()
                    ?.ImageUrl,
                Price = cartItem.Product?.Price ?? 0,
                Quantity = cartItem.Quantity,
                Stock = cartItem.Product?.Stock ?? 0,
                Subtotal = (cartItem.Product?.Price ?? 0) * cartItem.Quantity
            };
        }
    }
}
