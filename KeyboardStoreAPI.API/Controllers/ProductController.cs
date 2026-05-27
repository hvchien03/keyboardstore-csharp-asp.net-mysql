using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KeyboardStoreAPI.API.DTOs.Product;
using KeyboardStoreAPI.API.Services.Interfaces;
using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Get all products
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] PaginationParams paginationParams)
        {
            var pagedResult = await _productService.GetProductsPagedAsync(paginationParams);
            return Ok(pagedResult);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] ProductFilterParams filterParams)
        {
            var products = await _productService.SearchProductsAsync(filterParams);

            return Ok(products);
        }

        [HttpGet("without-images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetWithoutImages([FromQuery] ProductFilterParams filterParams)
        {
            var products = await _productService.GetProductsWithoutImagesAsync(filterParams);

            return Ok(products);
        }

        /// <summary>
        /// Get product by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            return Ok(product);
        }

        /// <summary>
        /// Create a new product (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
        {
            var product = await _productService.CreateProductAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        /// <summary>
        /// Update a product (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
        {
            var product = await _productService.UpdateProductAsync(id, dto);
            return Ok(product);
        }

        [HttpPost("{id}/images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddImages(int id, [FromForm] List<IFormFile> files)
        {
            var product = await _productService.AddProductImagesAsync(id, files);
            return Ok(product);
        }

        [HttpDelete("{id}/images/{imageId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteImage(int id, int imageId)
        {
            await _productService.DeleteProductImageAsync(id, imageId);
            return NoContent();
        }

        /// <summary>
        /// Delete a product (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
