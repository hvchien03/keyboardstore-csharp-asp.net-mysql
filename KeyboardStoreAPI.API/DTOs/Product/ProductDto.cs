namespace KeyboardStoreAPI.API.DTOs.Product
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int BrandId { get; set; }
        public string BrandName { get; set; } = string.Empty;
        public int? SwitchTypeId { get; set; }
        public string? SwitchTypeName { get; set; }
        public int? LayoutId { get; set; }
        public string? LayoutName { get; set; }
        public List<ProductImageDto> Images { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
