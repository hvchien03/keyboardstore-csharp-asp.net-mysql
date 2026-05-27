using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Repositories.Interfaces
{
    public interface IBrandRepository
    {
        Task<IEnumerable<Brand>> GetAllAsync();
        Task<Brand?> GetByIdAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> NameExistsAsync(string name, int? excludeId = null);
        Task<Brand> CreateAsync(Brand brand);
        Task<Brand> UpdateAsync(Brand brand);
        Task<bool> DeleteAsync(int id);
        Task<bool> HasProductsAsync(int id);
    }
}
