using KeyboardStoreAPI.API.DTOs.SwitchType;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface ISwitchTypeService
    {
        Task<IEnumerable<SwitchTypeDto>> GetAllSwitchTypesAsync();
        Task<SwitchTypeDto> GetSwitchTypeByIdAsync(int id);
        Task<SwitchTypeDto> CreateSwitchTypeAsync(CreateSwitchTypeDto dto);
        Task<SwitchTypeDto> UpdateSwitchTypeAsync(int id, UpdateSwitchTypeDto dto);
        Task<bool> DeleteSwitchTypeAsync(int id);
    }
}
