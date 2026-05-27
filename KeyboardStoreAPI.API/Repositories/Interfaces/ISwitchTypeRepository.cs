using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Repositories.Interfaces
{
    public interface ISwitchTypeRepository
    {
        Task<IEnumerable<SwitchType>> GetAllAsync();
        Task<SwitchType?> GetByIdAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> NameExistsAsync(string name, int? excludeId = null);
        Task<SwitchType> CreateAsync(SwitchType switchType);
        Task<SwitchType> UpdateAsync(SwitchType switchType);
        Task<bool> DeleteAsync(int id);
        Task<bool> HasProductsAsync(int id);
    }
}
