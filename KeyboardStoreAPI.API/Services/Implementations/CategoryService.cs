using KeyboardStoreAPI.API.DTOs.Category;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();

            return categories.Select(MapToDto);
        }

        public async Task<CategoryDto> GetCategoryByIdAsync(int id)
        {
            var category = await GetCategoryAsync(id);

            return MapToDto(category);
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name.Trim(),
                Description = dto.Description.Trim()
            };

            var createdCategory = await _categoryRepository.CreateAsync(category);

            return MapToDto(createdCategory);
        }

        public async Task<CategoryDto> UpdateCategoryAsync(int id, UpdateCategoryDto dto)
        {
            var category = await GetCategoryAsync(id);

            category.Name = dto.Name.Trim();
            category.Description = dto.Description.Trim();

            var updatedCategory = await _categoryRepository.UpdateAsync(category);

            return MapToDto(updatedCategory);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            if (!await _categoryRepository.ExistsAsync(id))
            {
                throw new NotFoundException($"Category with ID {id} not found");
            }

            if (await _categoryRepository.HasProductsAsync(id))
            {
                throw new BadRequestException("Cannot delete category that has products");
            }

            return await _categoryRepository.DeleteAsync(id);
        }

        private async Task<Category> GetCategoryAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
            {
                throw new NotFoundException($"Category with ID {id} not found");
            }

            return category;
        }

        private static CategoryDto MapToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description
            };
        }
    }
}
