using KeyboardStoreAPI.API.DTOs.Layout;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface ILayoutService
    {
        Task<IEnumerable<LayoutDto>> GetAllLayoutsAsync();
        Task<LayoutDto> GetLayoutByIdAsync(int id);
        Task<LayoutDto> CreateLayoutAsync(CreateLayoutDto dto);
        Task<LayoutDto> UpdateLayoutAsync(int id, UpdateLayoutDto dto);
        Task<bool> DeleteLayoutAsync(int id);
    }
}
