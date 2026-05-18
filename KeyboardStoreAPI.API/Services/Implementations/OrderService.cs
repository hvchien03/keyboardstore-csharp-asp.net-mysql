using KeyboardStoreAPI.API.Constants;
using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.DTOs.Order;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OrderService> _logger;
        private readonly IEmailService _emailService;

        public OrderService(
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            ApplicationDbContext context,
            ILogger<OrderService> logger,
            IEmailService emailService)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<OrderDto> CreateOrderAsync(
            int userId,
            CreateOrderDto dto,
            string paymentMethod = PaymentMethods.COD)
        {
            _logger.LogInformation(
                "Creating order for user {UserId} with {ItemCount} items",
                userId,
                dto.Items.Count);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var orderDetails = new List<OrderDetail>();
                decimal totalAmount = 0;

                foreach (var item in dto.Items)
                {
                    var product = await GetProductForOrder(item.ProductId, item.Quantity);

                    orderDetails.Add(new OrderDetail
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        Price = product.Price
                    });

                    totalAmount += product.Price * item.Quantity;

                    product.Stock -= item.Quantity;
                    await _productRepository.UpdateAsync(product);

                    _logger.LogInformation(
                        "Stock updated for product {ProductId}. New stock: {Stock}",
                        product.Id,
                        product.Stock);
                }

                var order = new Order
                {
                    UserId = userId,
                    TotalAmount = totalAmount,
                    Status = GetInitialOrderStatus(paymentMethod),
                    PaymentMethod = paymentMethod,
                    PaymentStatus = PaymentStatuses.Unpaid,
                    CreatedAt = DateTime.UtcNow,
                    ShippingName = dto.ShippingName.Trim(),
                    ShippingPhone = dto.ShippingPhone.Trim(),
                    ShippingAddress = dto.ShippingAddress.Trim(),
                    Note = dto.Note?.Trim(),
                    OrderDetails = orderDetails
                };

                var createdOrder = await _orderRepository.CreateAsync(order);

                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Order {OrderId} created successfully for user {UserId}. Total: {TotalAmount}",
                    createdOrder.Id,
                    userId,
                    totalAmount);

                await _emailService.SendOrderConfirmationEmailAsync(createdOrder.Id, createdOrder.User.Email);

                return await MapToOrderDto(createdOrder);
            }
            catch (Exception exception)
            {
                await transaction.RollbackAsync();
                _logger.LogError(exception, "Failed to create order for user {UserId}", userId);
                throw;
            }
        }

        public async Task<OrderDto> GetOrderByIdAsync(int orderId, int userId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                throw new NotFoundException($"Order with ID {orderId} not found");
            }

            if (order.UserId != userId)
            {
                throw new UnauthorizedAccessException("You can only view your own orders");
            }

            return await MapToOrderDto(order);
        }

        public async Task<OrderDto> GetOrderByIdForAdminAsync(int orderId)
        {
            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                throw new NotFoundException($"Order with ID {orderId} not found");
            }

            return await MapToOrderDto(order);
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            var orderDtos = new List<OrderDto>();

            foreach (var order in orders)
            {
                orderDtos.Add(await MapToOrderDto(order));
            }

            return orderDtos;
        }

        public async Task<PagedResult<OrderDto>> GetOrdersPagedAsync(OrderFilterParams filterParams)
        {
            ValidateOrderFilterParams(filterParams);

            var pagedOrders = await _orderRepository.GetPagedAsync(filterParams);
            var orderDtos = new List<OrderDto>();

            foreach (var order in pagedOrders.Data)
            {
                orderDtos.Add(await MapToOrderDto(order));
            }

            return new PagedResult<OrderDto>
            {
                Data = orderDtos,
                Page = pagedOrders.Page,
                PageSize = pagedOrders.PageSize,
                TotalCount = pagedOrders.TotalCount,
                TotalPages = pagedOrders.TotalPages
            };
        }

        public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            var orderDtos = new List<OrderDto>();

            foreach (var order in orders)
            {
                orderDtos.Add(await MapToOrderDto(order));
            }

            return orderDtos;
        }

        public async Task<OrderDto> UpdateOrderStatusAsync(int orderId, string status)
        {
            if (!OrderStatuses.IsValid(status))
            {
                throw new BadRequestException(
                    $"Invalid status. Valid statuses: {string.Join(", ", OrderStatuses.ValidStatuses)}");
            }

            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new NotFoundException("Order not found");
            }

            if (status == OrderStatuses.Cancelled && order.Status != OrderStatuses.Cancelled)
            {
                await CancelOrderAsync(order);
            }
            else
            {
                order.Status = status;
                await _orderRepository.UpdateAsync(order);
            }

            return await MapToOrderDto(order);
        }

        private async Task<Product> GetProductForOrder(int productId, int quantity)
        {
            var product = await _productRepository.GetByIdAsync(productId);

            if (product == null)
            {
                _logger.LogWarning("Product ID {ProductId} not found", productId);
                throw new NotFoundException($"Product ID {productId} not found");
            }

            if (product.Stock < quantity)
            {
                _logger.LogWarning(
                    "Insufficient stock for product {ProductId}. Stock: {Stock}, Requested: {Quantity}",
                    product.Id,
                    product.Stock,
                    quantity);

                throw new BadRequestException(
                    $"Product '{product.Name}' only has {product.Stock} in stock, but you ordered {quantity}");
            }

            return product;
        }

        private static string GetInitialOrderStatus(string paymentMethod)
        {
            if (!PaymentMethods.IsValid(paymentMethod))
            {
                throw new BadRequestException(
                    $"Invalid payment method. Valid methods: {string.Join(", ", PaymentMethods.ValidMethods)}");
            }

            return paymentMethod == PaymentMethods.COD
                ? OrderStatuses.Pending
                : OrderStatuses.PendingPayment;
        }

        private async Task CancelOrderAsync(Order order)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var detail in order.OrderDetails)
                {
                    var product = await _productRepository.GetByIdAsync(detail.ProductId);
                    if (product == null)
                    {
                        continue;
                    }

                    product.Stock += detail.Quantity;
                    await _productRepository.UpdateAsync(product);
                }

                order.Status = OrderStatuses.Cancelled;
                await _orderRepository.UpdateAsync(order);
                await _emailService.SendOrderStatusUpdateEmailAsync(order.Id, order.User.Email, order.Status);

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task<OrderDto> MapToOrderDto(Order order)
        {
            if (order.User == null)
            {
                await _context.Entry(order)
                    .Reference(o => o.User)
                    .LoadAsync();
            }

            if (!order.OrderDetails.Any())
            {
                await _context.Entry(order)
                    .Collection(o => o.OrderDetails)
                    .LoadAsync();
            }

            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                UserEmail = order.User?.Email ?? "Unknown",
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                CreatedAt = order.CreatedAt,
                PaymentMethod = order.PaymentMethod,
                PaymentStatus = order.PaymentStatus,
                TransactionId = order.TransactionId,
                PaidAt = order.PaidAt,
                ShippingName = order.ShippingName,
                ShippingPhone = order.ShippingPhone,
                ShippingAddress = order.ShippingAddress,
                Note = order.Note,
                OrderDetails = order.OrderDetails.Select(od => new OrderDetailDto
                {
                    Id = od.Id,
                    ProductId = od.ProductId,
                    ProductName = od.Product?.Name ?? "Unknown",
                    Quantity = od.Quantity,
                    Price = od.Price,
                    Subtotal = od.Price * od.Quantity
                }).ToList()
            };
        }

        private static void ValidateOrderFilterParams(OrderFilterParams filterParams)
        {
            if (!string.IsNullOrWhiteSpace(filterParams.Status)
                && !OrderStatuses.IsValid(filterParams.Status))
            {
                throw new BadRequestException(
                    $"Invalid status. Valid statuses: {string.Join(", ", OrderStatuses.ValidStatuses)}");
            }

            if (!string.IsNullOrWhiteSpace(filterParams.PaymentStatus)
                && !PaymentStatuses.IsValid(filterParams.PaymentStatus))
            {
                throw new BadRequestException(
                    $"Invalid payment status. Valid values: {string.Join(", ", PaymentStatuses.ValidStatuses)}");
            }

            if (filterParams.FromDate.HasValue
                && filterParams.ToDate.HasValue
                && filterParams.FromDate.Value > filterParams.ToDate.Value)
            {
                throw new BadRequestException("From date cannot be later than to date");
            }
        }
    }
}
