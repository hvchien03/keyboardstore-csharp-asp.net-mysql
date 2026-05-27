using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Repositories.Interfaces
{
    public interface ILayoutRepository
    {
        Task<IEnumerable<Layout>> GetAllAsync();
        Task<Layout?> GetByIdAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> NameExistsAsync(string name, int? excludeId = null);
        Task<Layout> CreateAsync(Layout layout);
        Task<Layout> UpdateAsync(Layout layout);
        Task<bool> DeleteAsync(int id);
        Task<bool> HasProductsAsync(int id);
    }
}
