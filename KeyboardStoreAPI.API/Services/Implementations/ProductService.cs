using KeyboardStoreAPI.API.DTOs.Product;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;
using KeyboardStoreAPI.API.Exceptions;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICacheService _cacheService;
        private readonly IConfiguration _configuration;
        private readonly ILogger<ProductService> _logger;

        // Cache keys
        private readonly string _productsCacheKey;
        private readonly string _productCachePrefix;

        public ProductService(
            IProductRepository productRepository,
            ICacheService cacheService,
            IConfiguration configuration,
            ILogger<ProductService> logger)
        {
            _productRepository = productRepository;
            _cacheService = cacheService;
            _configuration = configuration;
            _logger = logger;

            // Lấy cache keys từ appsettings.json
            _productsCacheKey = configuration["CacheSettings:ProductsCacheKey"]!;
            _productCachePrefix = configuration["CacheSettings:ProductCacheKeyPrefix"]!;
        }

        // GetAll - CÓ CACHE
        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            // 1. Thử lấy từ cache trước
            var cachedProducts = await _cacheService.GetAsync<IEnumerable<ProductDto>>(_productsCacheKey);

            if (cachedProducts != null)
            {
                return cachedProducts; // Trả về từ cache (NHANH!)
            }

            // 2. Nếu không có cache, lấy từ database
            var products = await _productRepository.GetAllAsync();

            var productDtos = products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name ?? "Unknown",
                CreatedAt = p.CreatedAt
            }).ToList();

            // 3. Lưu vào cache cho lần sau
            await _cacheService.SetAsync(_productsCacheKey, productDtos, TimeSpan.FromMinutes(10));

            return productDtos;
        }

        public async Task<PagedResult<ProductDto>> GetProductsPagedAsync(PaginationParams paginationParams)
        {
            _logger.LogInformation(
                "Getting products with pagination. Page: {Page}, PageSize: {PageSize}",
                paginationParams.Page, paginationParams.PageSize);

            // Lấy tất cả products
            var allProducts = await _productRepository.GetAllAsync();

            // Đếm tổng số
            var totalCount = allProducts.Count();

            // Tính tổng số trang
            var totalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize);

            // Lấy data của trang hiện tại
            var products = allProducts
                .Skip((paginationParams.Page - 1) * paginationParams.PageSize) // Bỏ qua các item trước
                .Take(paginationParams.PageSize) // Lấy số lượng item của trang
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category?.Name ?? "Unknown",
                    CreatedAt = p.CreatedAt
                })
                .ToList();

            return new PagedResult<ProductDto>
            {
                Data = products,
                Page = paginationParams.Page,
                PageSize = paginationParams.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }

        // GetById - CÓ CACHE
        public async Task<PagedResult<ProductDto>> SearchProductsAsync(ProductFilterParams filterParams)
        {
            ValidateProductFilterParams(filterParams);

            var pagedProducts = await _productRepository.GetFilteredAsync(filterParams);
            var products = pagedProducts.Data
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category?.Name ?? "Unknown",
                    CreatedAt = p.CreatedAt
                })
                .ToList();

            return new PagedResult<ProductDto>
            {
                Data = products,
                Page = pagedProducts.Page,
                PageSize = pagedProducts.PageSize,
                TotalCount = pagedProducts.TotalCount,
                TotalPages = pagedProducts.TotalPages
            };
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var cacheKey = $"{_productCachePrefix}{id}"; // "product:1", "product:2"...

            // 1. Thử lấy từ cache
            var cachedProduct = await _cacheService.GetAsync<ProductDto>(cacheKey);

            if (cachedProduct != null)
            {
                return cachedProduct;
            }

            // 2. Lấy từ database
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new NotFoundException($"Product with ID {id} not found");
            }


            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name ?? "Unknown",
                CreatedAt = product.CreatedAt
            };

            // 3. Lưu vào cache
            await _cacheService.SetAsync(cacheKey, productDto, TimeSpan.FromMinutes(10));

            return productDto;
        }

        // Create - XÓA CACHE SAU KHI TẠO
        public async Task<ProductDto> CreateProductAsync(CreateProductDto dto)
        {
            ValidateWholeVndPrice(dto.Price);

            if (!await _productRepository.CategoryExistsAsync(dto.CategoryId))
            {
                throw new NotFoundException("Category not found");
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            var createdProduct = await _productRepository.CreateAsync(product);

            // XÓA CACHE SAU KHI TẠO MỚI (Cache Invalidation)
            await _cacheService.RemoveAsync(_productsCacheKey);

            return new ProductDto
            {
                Id = createdProduct.Id,
                Name = createdProduct.Name,
                Description = createdProduct.Description,
                Price = createdProduct.Price,
                Stock = createdProduct.Stock,
                ImageUrl = createdProduct.ImageUrl,
                CategoryId = createdProduct.CategoryId,
                CategoryName = createdProduct.Category?.Name ?? "Unknown",
                CreatedAt = createdProduct.CreatedAt
            };
        }

        // Update - XÓA CACHE SAU KHI CẬP NHẬT
        public async Task<ProductDto> UpdateProductAsync(int id, UpdateProductDto dto)
        {
            ValidateWholeVndPrice(dto.Price);

            if (!await _productRepository.ExistsAsync(id))
            {
                throw new NotFoundException("Product not found");
            }

            if (!await _productRepository.CategoryExistsAsync(dto.CategoryId))
            {
                throw new NotFoundException("Category not found");
            }

            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
            {
                throw new NotFoundException("Product not found");
            }

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Stock = dto.Stock;
            product.ImageUrl = dto.ImageUrl;
            product.CategoryId = dto.CategoryId;

            var updatedProduct = await _productRepository.UpdateAsync(product);

            // XÓA CACHE (cả danh sách và chi tiết product)
            await _cacheService.RemoveAsync(_productsCacheKey); // Xóa cache danh sách
            await _cacheService.RemoveAsync($"{_productCachePrefix}{id}"); // Xóa cache chi tiết

            return new ProductDto
            {
                Id = updatedProduct.Id,
                Name = updatedProduct.Name,
                Description = updatedProduct.Description,
                Price = updatedProduct.Price,
                Stock = updatedProduct.Stock,
                ImageUrl = updatedProduct.ImageUrl,
                CategoryId = updatedProduct.CategoryId,
                CategoryName = updatedProduct.Category?.Name ?? "Unknown",
                CreatedAt = updatedProduct.CreatedAt
            };
        }

        // Delete - XÓA CACHE SAU KHI XÓA
        public async Task<bool> DeleteProductAsync(int id)
        {
            if (!await _productRepository.ExistsAsync(id))
            {
                throw new NotFoundException("Product not found");
            }

            var result = await _productRepository.DeleteAsync(id);

            // XÓA CACHE
            await _cacheService.RemoveAsync(_productsCacheKey);
            await _cacheService.RemoveAsync($"{_productCachePrefix}{id}");

            return result;
        }

        private static void ValidateWholeVndPrice(decimal price)
        {
            if (price % 1 != 0)
            {
                throw new BadRequestException("Product price must be a whole VND amount");
            }
        }

        private static void ValidateProductFilterParams(ProductFilterParams filterParams)
        {
            if (filterParams.MinPrice.HasValue && filterParams.MinPrice.Value < 0)
            {
                throw new BadRequestException("Min price cannot be negative");
            }

            if (filterParams.MaxPrice.HasValue && filterParams.MaxPrice.Value < 0)
            {
                throw new BadRequestException("Max price cannot be negative");
            }

            if (filterParams.MinPrice.HasValue
                && filterParams.MaxPrice.HasValue
                && filterParams.MinPrice.Value > filterParams.MaxPrice.Value)
            {
                throw new BadRequestException("Min price cannot be greater than max price");
            }

            var validSortByValues = new[] { "price_asc", "price_desc", "name", "oldest" };
            if (!string.IsNullOrWhiteSpace(filterParams.SortBy)
                && !validSortByValues.Contains(filterParams.SortBy.ToLowerInvariant()))
            {
                throw new BadRequestException(
                    $"Invalid sortBy. Valid values: {string.Join(", ", validSortByValues)}");
            }
        }
    }
}
