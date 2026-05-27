namespace KeyboardStoreAPI.API.DTOs.Product
{
    public class ProductImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Alt { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
}
