using KeyboardStoreAPI.API.DTOs.Layout;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class LayoutService : ILayoutService
    {
        private readonly ILayoutRepository _layoutRepository;

        public LayoutService(ILayoutRepository layoutRepository)
        {
            _layoutRepository = layoutRepository;
        }

        public async Task<IEnumerable<LayoutDto>> GetAllLayoutsAsync()
        {
            var layouts = await _layoutRepository.GetAllAsync();
            return layouts.Select(MapToDto);
        }

        public async Task<LayoutDto> GetLayoutByIdAsync(int id)
        {
            var layout = await GetLayoutAsync(id);
            return MapToDto(layout);
        }

        public async Task<LayoutDto> CreateLayoutAsync(CreateLayoutDto dto)
        {
            var name = dto.Name.Trim();
            if (await _layoutRepository.NameExistsAsync(name))
            {
                throw new BadRequestException("Layout name already exists");
            }

            var layout = new Layout
            {
                Name = name,
                Percentage = dto.Percentage.Trim(),
                Description = dto.Description.Trim()
            };

            return MapToDto(await _layoutRepository.CreateAsync(layout));
        }

        public async Task<LayoutDto> UpdateLayoutAsync(int id, UpdateLayoutDto dto)
        {
            var layout = await GetLayoutAsync(id);
            var name = dto.Name.Trim();

            if (await _layoutRepository.NameExistsAsync(name, id))
            {
                throw new BadRequestException("Layout name already exists");
            }

            layout.Name = name;
            layout.Percentage = dto.Percentage.Trim();
            layout.Description = dto.Description.Trim();

            return MapToDto(await _layoutRepository.UpdateAsync(layout));
        }

        public async Task<bool> DeleteLayoutAsync(int id)
        {
            if (!await _layoutRepository.ExistsAsync(id))
            {
                throw new NotFoundException($"Layout with ID {id} not found");
            }

            if (await _layoutRepository.HasProductsAsync(id))
            {
                throw new BadRequestException("Cannot delete layout that has products");
            }

            return await _layoutRepository.DeleteAsync(id);
        }

        private async Task<Layout> GetLayoutAsync(int id)
        {
            var layout = await _layoutRepository.GetByIdAsync(id);
            if (layout == null)
            {
                throw new NotFoundException($"Layout with ID {id} not found");
            }

            return layout;
        }

        private static LayoutDto MapToDto(Layout layout)
        {
            return new LayoutDto
            {
                Id = layout.Id,
                Name = layout.Name,
                Percentage = layout.Percentage,
                Description = layout.Description
            };
        }
    }
}
