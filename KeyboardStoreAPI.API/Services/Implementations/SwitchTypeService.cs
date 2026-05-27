using KeyboardStoreAPI.API.DTOs.SwitchType;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class SwitchTypeService : ISwitchTypeService
    {
        private readonly ISwitchTypeRepository _switchTypeRepository;

        public SwitchTypeService(ISwitchTypeRepository switchTypeRepository)
        {
            _switchTypeRepository = switchTypeRepository;
        }

        public async Task<IEnumerable<SwitchTypeDto>> GetAllSwitchTypesAsync()
        {
            var switchTypes = await _switchTypeRepository.GetAllAsync();
            return switchTypes.Select(MapToDto);
        }

        public async Task<SwitchTypeDto> GetSwitchTypeByIdAsync(int id)
        {
            var switchType = await GetSwitchTypeAsync(id);
            return MapToDto(switchType);
        }

        public async Task<SwitchTypeDto> CreateSwitchTypeAsync(CreateSwitchTypeDto dto)
        {
            var name = dto.Name.Trim();
            if (await _switchTypeRepository.NameExistsAsync(name))
            {
                throw new BadRequestException("Switch type name already exists");
            }

            var switchType = new SwitchType
            {
                Name = name,
                Description = dto.Description.Trim()
            };

            return MapToDto(await _switchTypeRepository.CreateAsync(switchType));
        }

        public async Task<SwitchTypeDto> UpdateSwitchTypeAsync(int id, UpdateSwitchTypeDto dto)
        {
            var switchType = await GetSwitchTypeAsync(id);
            var name = dto.Name.Trim();

            if (await _switchTypeRepository.NameExistsAsync(name, id))
            {
                throw new BadRequestException("Switch type name already exists");
            }

            switchType.Name = name;
            switchType.Description = dto.Description.Trim();

            return MapToDto(await _switchTypeRepository.UpdateAsync(switchType));
        }

        public async Task<bool> DeleteSwitchTypeAsync(int id)
        {
            if (!await _switchTypeRepository.ExistsAsync(id))
            {
                throw new NotFoundException($"Switch type with ID {id} not found");
            }

            if (await _switchTypeRepository.HasProductsAsync(id))
            {
                throw new BadRequestException("Cannot delete switch type that has products");
            }

            return await _switchTypeRepository.DeleteAsync(id);
        }

        private async Task<SwitchType> GetSwitchTypeAsync(int id)
        {
            var switchType = await _switchTypeRepository.GetByIdAsync(id);
            if (switchType == null)
            {
                throw new NotFoundException($"Switch type with ID {id} not found");
            }

            return switchType;
        }

        private static SwitchTypeDto MapToDto(SwitchType switchType)
        {
            return new SwitchTypeDto
            {
                Id = switchType.Id,
                Name = switchType.Name,
                Description = switchType.Description
            };
        }
    }
}
