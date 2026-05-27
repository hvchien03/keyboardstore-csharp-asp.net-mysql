using KeyboardStoreAPI.API.DTOs.Brand;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandDto>> GetAllBrandsAsync();
        Task<BrandDto> GetBrandByIdAsync(int id);
        Task<BrandDto> CreateBrandAsync(CreateBrandDto dto);
        Task<BrandDto> UpdateBrandAsync(int id, UpdateBrandDto dto);
        Task<bool> DeleteBrandAsync(int id);
    }
}
