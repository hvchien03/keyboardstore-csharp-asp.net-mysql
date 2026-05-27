using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    public class LayoutRepository : ILayoutRepository
    {
        private readonly ApplicationDbContext _context;

        public LayoutRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Layout>> GetAllAsync()
        {
            return await _context.Layouts.OrderBy(l => l.Name).ToListAsync();
        }

        public async Task<Layout?> GetByIdAsync(int id)
        {
            return await _context.Layouts.FindAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Layouts.AnyAsync(l => l.Id == id);
        }

        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            return await _context.Layouts.AnyAsync(l => l.Name == name && (!excludeId.HasValue || l.Id != excludeId.Value));
        }

        public async Task<Layout> CreateAsync(Layout layout)
        {
            _context.Layouts.Add(layout);
            await _context.SaveChangesAsync();
            return layout;
        }

        public async Task<Layout> UpdateAsync(Layout layout)
        {
            _context.Layouts.Update(layout);
            await _context.SaveChangesAsync();
            return layout;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var layout = await _context.Layouts.FindAsync(id);
            if (layout == null)
            {
                return false;
            }

            _context.Layouts.Remove(layout);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HasProductsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.LayoutId == id);
        }
    }
}
