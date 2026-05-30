using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Constants;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;

        public CartRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CartItem>> GetByUserIdAsync(int userId)
        {
            return await _context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.ProductImages)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .ToListAsync();
        }

        public async Task<CartItem?> GetByUserAndProductAsync(int userId, int productId)
        {
            return await _context.CartItems
                .Include(c => c.Product)
                    .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);
        }

        public async Task<CartItem> AddAsync(CartItem cartItem)
        {
            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            await _context.Entry(cartItem)
                .Reference(c => c.Product)
                .LoadAsync();
            await _context.Entry(cartItem.Product)
                .Collection(p => p.ProductImages)
                .LoadAsync();

            return cartItem;
        }

        public async Task<CartItem> UpdateAsync(CartItem cartItem)
        {
            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();

            await _context.Entry(cartItem)
                .Reference(c => c.Product)
                .LoadAsync();
            await _context.Entry(cartItem.Product)
                .Collection(p => p.ProductImages)
                .LoadAsync();

            return cartItem;
        }

        public async Task<bool> RemoveAsync(int userId, int productId)
        {
            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (cartItem == null)
            {
                return false;
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<int> RemoveItemsAsync(int userId, IEnumerable<int> productIds)
        {
            var productIdList = productIds.Distinct().ToList();
            if (!productIdList.Any())
            {
                return 0;
            }

            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId && productIdList.Contains(c.ProductId))
                .ToListAsync();

            if (!cartItems.Any())
            {
                return 0;
            }

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return cartItems.Count;
        }

        public async Task<int> RemovePaidOrderItemsAsync(int userId)
        {
            var paidProductIds = await _context.Orders
                .Where(order => order.UserId == userId
                    && order.PaymentStatus == PaymentStatuses.Paid
                    && order.PaidAt.HasValue)
                .SelectMany(order => order.OrderDetails.Select(detail => new
                {
                    detail.ProductId,
                    PaidAt = order.PaidAt!.Value
                }))
                .ToListAsync();

            if (!paidProductIds.Any())
            {
                return 0;
            }

            var cartItems = await _context.CartItems
                .Where(cartItem => cartItem.UserId == userId)
                .ToListAsync();

            var itemsToRemove = cartItems
                .Where(cartItem => paidProductIds.Any(paidItem =>
                    paidItem.ProductId == cartItem.ProductId
                    && cartItem.CreatedAt <= paidItem.PaidAt))
                .ToList();

            if (!itemsToRemove.Any())
            {
                return 0;
            }

            _context.CartItems.RemoveRange(itemsToRemove);
            await _context.SaveChangesAsync();

            return itemsToRemove.Count;
        }

        public async Task ClearAsync(int userId)
        {
            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }
    }
}
