using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<PagedResult<Product>> GetFilteredAsync(ProductFilterParams filterParams);
        Task<PagedResult<Product>> GetWithoutImagesAsync(ProductFilterParams filterParams);
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<Product> UpdateAsync(Product product);
        Task<Product> AddImagesAsync(int productId, IEnumerable<ProductImage> images);
        Task<ProductImage?> GetImageAsync(int productId, int imageId);
        Task<bool> DeleteImageAsync(int productId, int imageId);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<bool> CategoryExistsAsync(int categoryId);
        Task<bool> BrandExistsAsync(int brandId);
        Task<bool> SwitchTypeExistsAsync(int switchTypeId);
        Task<bool> LayoutExistsAsync(int layoutId);
    }
}
