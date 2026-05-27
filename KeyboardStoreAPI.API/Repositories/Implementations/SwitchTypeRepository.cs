using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Repositories.Implementations
{
    public class SwitchTypeRepository : ISwitchTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public SwitchTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SwitchType>> GetAllAsync()
        {
            return await _context.SwitchTypes.OrderBy(s => s.Name).ToListAsync();
        }

        public async Task<SwitchType?> GetByIdAsync(int id)
        {
            return await _context.SwitchTypes.FindAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.SwitchTypes.AnyAsync(s => s.Id == id);
        }

        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            return await _context.SwitchTypes.AnyAsync(s => s.Name == name && (!excludeId.HasValue || s.Id != excludeId.Value));
        }

        public async Task<SwitchType> CreateAsync(SwitchType switchType)
        {
            _context.SwitchTypes.Add(switchType);
            await _context.SaveChangesAsync();
            return switchType;
        }

        public async Task<SwitchType> UpdateAsync(SwitchType switchType)
        {
            _context.SwitchTypes.Update(switchType);
            await _context.SaveChangesAsync();
            return switchType;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var switchType = await _context.SwitchTypes.FindAsync(id);
            if (switchType == null)
            {
                return false;
            }

            _context.SwitchTypes.Remove(switchType);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> HasProductsAsync(int id)
        {
            return await _context.Products.AnyAsync(p => p.SwitchTypeId == id);
        }
    }
}
