using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await GetOrderQuery()
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await GetOrderQuery()
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<PagedResult<Order>> GetPagedAsync(OrderFilterParams filterParams)
        {
            var query = ApplyFilters(GetOrderQuery(), filterParams);
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)filterParams.PageSize);
            var orders = await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((filterParams.Page - 1) * filterParams.PageSize)
                .Take(filterParams.PageSize)
                .ToListAsync();

            return new PagedResult<Order>
            {
                Data = orders,
                Page = filterParams.Page,
                PageSize = filterParams.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }

        public async Task<IEnumerable<Order>> GetByUserIdAsync(int userId)
        {
            return await GetOrderQuery()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }

        public async Task<Order> CreateAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            await _context.Entry(order)
                .Reference(o => o.User)
                .LoadAsync();

            return order;
        }

        public async Task<Order> UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return order;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return false;
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return true;
        }

        private IQueryable<Order> GetOrderQuery()
        {
            return _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product);
        }

        private static IQueryable<Order> ApplyFilters(
            IQueryable<Order> query,
            OrderFilterParams filterParams)
        {
            if (filterParams.UserId.HasValue)
            {
                query = query.Where(o => o.UserId == filterParams.UserId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filterParams.Status))
            {
                query = query.Where(o => o.Status == filterParams.Status);
            }

            if (!string.IsNullOrWhiteSpace(filterParams.PaymentStatus))
            {
                query = query.Where(o => o.PaymentStatus == filterParams.PaymentStatus);
            }

            if (filterParams.FromDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt >= filterParams.FromDate.Value);
            }

            if (filterParams.ToDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt <= filterParams.ToDate.Value);
            }

            return query;
        }
    }
}
