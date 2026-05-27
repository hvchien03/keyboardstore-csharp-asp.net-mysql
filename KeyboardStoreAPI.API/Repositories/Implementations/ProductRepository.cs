using Microsoft.EntityFrameworkCore;
using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.SwitchType)
                .Include(p => p.Layout)
                .Include(p => p.ProductImages.OrderBy(i => i.DisplayOrder))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<PagedResult<Product>> GetFilteredAsync(ProductFilterParams filterParams)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.SwitchType)
                .Include(p => p.Layout)
                .Include(p => p.ProductImages.OrderBy(i => i.DisplayOrder))
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterParams.Keyword))
            {
                var keyword = filterParams.Keyword.Trim();
                query = query.Where(p =>
                    p.Name.Contains(keyword)
                    || p.Description.Contains(keyword));
            }

            if (filterParams.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == filterParams.CategoryId.Value);
            }

            if (filterParams.BrandId.HasValue)
            {
                query = query.Where(p => p.BrandId == filterParams.BrandId.Value);
            }

            if (filterParams.SwitchTypeId.HasValue)
            {
                query = query.Where(p => p.SwitchTypeId == filterParams.SwitchTypeId.Value);
            }

            if (filterParams.LayoutId.HasValue)
            {
                query = query.Where(p => p.LayoutId == filterParams.LayoutId.Value);
            }

            if (filterParams.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= filterParams.MinPrice.Value);
            }

            if (filterParams.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= filterParams.MaxPrice.Value);
            }

            if (filterParams.InStock.HasValue)
            {
                query = filterParams.InStock.Value
                    ? query.Where(p => p.Stock > 0)
                    : query.Where(p => p.Stock == 0);
            }

            query = filterParams.SortBy?.ToLowerInvariant() switch
            {
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                "name" => query.OrderBy(p => p.Name),
                "oldest" => query.OrderBy(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)filterParams.PageSize);
            var products = await query
                .Skip((filterParams.Page - 1) * filterParams.PageSize)
                .Take(filterParams.PageSize)
                .ToListAsync();

            return new PagedResult<Product>
            {
                Data = products,
                Page = filterParams.Page,
                PageSize = filterParams.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.SwitchType)
                .Include(p => p.Layout)
                .Include(p => p.ProductImages.OrderBy(i => i.DisplayOrder))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            // Load category after creating
            await _context.Entry(product)
                .Reference(p => p.Category)
                .LoadAsync();
            await _context.Entry(product)
                .Reference(p => p.Brand)
                .LoadAsync();
            await _context.Entry(product)
                .Reference(p => p.SwitchType)
                .LoadAsync();
            await _context.Entry(product)
                .Reference(p => p.Layout)
                .LoadAsync();
            await _context.Entry(product)
                .Collection(p => p.ProductImages)
                .LoadAsync();
            
            return product;
        }

        public async Task<Product> UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            
            // Load category after updating
            await _context.Entry(product)
                .Reference(p => p.Category)
                .LoadAsync();
            await _context.Entry(product)
                .Reference(p => p.Brand)
                .LoadAsync();
            await _context.Entry(product)
                .Reference(p => p.SwitchType)
                .LoadAsync();
            await _context.Entry(product)
                .Reference(p => p.Layout)
                .LoadAsync();
            await _context.Entry(product)
                .Collection(p => p.ProductImages)
                .LoadAsync();
            
            return product;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.Id == id);
        }

        public async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(c => c.Id == categoryId);
        }

        public async Task<bool> BrandExistsAsync(int brandId)
        {
            return await _context.Brands.AnyAsync(b => b.Id == brandId);
        }

        public async Task<bool> SwitchTypeExistsAsync(int switchTypeId)
        {
            return await _context.SwitchTypes.AnyAsync(s => s.Id == switchTypeId);
        }

        public async Task<bool> LayoutExistsAsync(int layoutId)
        {
            return await _context.Layouts.AnyAsync(l => l.Id == layoutId);
        }
    }
}
