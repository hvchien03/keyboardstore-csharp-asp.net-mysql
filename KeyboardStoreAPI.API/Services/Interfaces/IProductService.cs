using KeyboardStoreAPI.API.DTOs.Product;
using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<PagedResult<ProductDto>> GetProductsPagedAsync(PaginationParams paginationParams);
        Task<PagedResult<ProductDto>> SearchProductsAsync(ProductFilterParams filterParams);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto dto);
        Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto dto);
        Task<bool> DeleteProductAsync(int id);
    }
}
