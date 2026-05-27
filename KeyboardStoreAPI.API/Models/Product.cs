namespace KeyboardStoreAPI.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public int? SwitchTypeId { get; set; }
        public int? LayoutId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        public Category Category { get; set; } = null!;
        public Brand Brand { get; set; } = null!;
        public SwitchType? SwitchType { get; set; }
        public Layout? Layout { get; set; }
        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
