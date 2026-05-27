using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    public class BrandRepository : IBrandRepository
    {
        private readonly ApplicationDbContext _context;

        public BrandRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Brand>> GetAllAsync()
        {
            return await _context.Brands.OrderBy(b => b.Name).ToListAsync();
        }

        public async Task<Brand?> GetByIdAsync(int id)
        {
            return await _context.Brands.FindAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Brands.AnyAsync(b => b.Id == id);
        }

        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            return await _context.Brands.AnyAsync(b => b.Name == name && (!excludeId.HasValue || b.Id != excludeId.Value));
        }

        public async Task<Brand> CreateAsync(Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task<Brand> UpdateAsync(Brand brand)
        {
            _context.Brands.Update(brand);
            await _context.SaveChangesAsync();
            return brand;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return false;
            }

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HasProductsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.BrandId == id);
        }
    }
}
