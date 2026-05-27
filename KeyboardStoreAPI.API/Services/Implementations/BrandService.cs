using KeyboardStoreAPI.API.DTOs.Brand;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;

        public BrandService(IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
        }

        public async Task<IEnumerable<BrandDto>> GetAllBrandsAsync()
        {
            var brands = await _brandRepository.GetAllAsync();
            return brands.Select(MapToDto);
        }

        public async Task<BrandDto> GetBrandByIdAsync(int id)
        {
            var brand = await GetBrandAsync(id);
            return MapToDto(brand);
        }

        public async Task<BrandDto> CreateBrandAsync(CreateBrandDto dto)
        {
            var name = dto.Name.Trim();
            if (await _brandRepository.NameExistsAsync(name))
            {
                throw new BadRequestException("Brand name already exists");
            }

            var brand = new Brand
            {
                Name = name,
                Description = dto.Description.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            return MapToDto(await _brandRepository.CreateAsync(brand));
        }

        public async Task<BrandDto> UpdateBrandAsync(int id, UpdateBrandDto dto)
        {
            var brand = await GetBrandAsync(id);
            var name = dto.Name.Trim();

            if (await _brandRepository.NameExistsAsync(name, id))
            {
                throw new BadRequestException("Brand name already exists");
            }

            brand.Name = name;
            brand.Description = dto.Description.Trim();

            return MapToDto(await _brandRepository.UpdateAsync(brand));
        }

        public async Task<bool> DeleteBrandAsync(int id)
        {
            if (!await _brandRepository.ExistsAsync(id))
            {
                throw new NotFoundException($"Brand with ID {id} not found");
            }

            if (await _brandRepository.HasProductsAsync(id))
            {
                throw new BadRequestException("Cannot delete brand that has products");
            }

            return await _brandRepository.DeleteAsync(id);
        }

        private async Task<Brand> GetBrandAsync(int id)
        {
            var brand = await _brandRepository.GetByIdAsync(id);
            if (brand == null)
            {
                throw new NotFoundException($"Brand with ID {id} not found");
            }

            return brand;
        }

        private static BrandDto MapToDto(Brand brand)
        {
            return new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Description = brand.Description,
                CreatedAt = brand.CreatedAt
            };
        }
    }
}
