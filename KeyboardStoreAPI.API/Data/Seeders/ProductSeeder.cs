namespace KeyboardStoreAPI.API.Data.Seeders
{
    public static class ProductSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (context.Products.Any())
            {
                return;
            }

            var mechanicalCategory = context.Categories.First(c => c.Name == "Mechanical Keyboards");
            var keycapsCategory = context.Categories.First(c => c.Name == "Keycaps");
            var keychronBrand = context.Brands.First(b => b.Name == "Keychron");
            var royalKludgeBrand = context.Brands.First(b => b.Name == "Royal Kludge");
            var gmkBrand = context.Brands.First(b => b.Name == "GMK");
            var clickySwitch = context.SwitchTypes.First(s => s.Name == "Clicky");
            var linearSwitch = context.SwitchTypes.First(s => s.Name == "Linear");
            var layout60 = context.Layouts.First(l => l.Name == "60%");
            var layout75 = context.Layouts.First(l => l.Name == "75%");

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Keychron K2 V2",
                    Description = "Wireless mechanical keyboard with hot-swappable switches",
                    Price = 2400000m,
                    Stock = 50,
                    CategoryId = mechanicalCategory.Id,
                    BrandId = keychronBrand.Id,
                    SwitchTypeId = clickySwitch.Id,
                    LayoutId = layout75.Id,
                    ProductImages = new List<ProductImage>
                    {
                        new ProductImage
                        {
                            ImageUrl = "/images/products/keyboard-base.jpg",
                            Alt = "Keychron K2 V2 keyboard",
                            DisplayOrder = 1,
                            CreatedAt = DateTime.UtcNow
                        }
                    },
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Royal Kludge RK61",
                    Description = "Compact 60% mechanical keyboard",
                    Price = 1600000m,
                    Stock = 30,
                    CategoryId = mechanicalCategory.Id,
                    BrandId = royalKludgeBrand.Id,
                    SwitchTypeId = linearSwitch.Id,
                    LayoutId = layout60.Id,
                    ProductImages = new List<ProductImage>
                    {
                        new ProductImage
                        {
                            ImageUrl = "/images/products/hero-keyboard.jpg",
                            Alt = "Royal Kludge RK61 keyboard",
                            DisplayOrder = 1,
                            CreatedAt = DateTime.UtcNow
                        }
                    },
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "GMK Olivia++ Keycaps",
                    Description = "Premium PBT keycap set",
                    Price = 3200000m,
                    Stock = 15,
                    CategoryId = keycapsCategory.Id,
                    BrandId = gmkBrand.Id,
                    ProductImages = new List<ProductImage>
                    {
                        new ProductImage
                        {
                            ImageUrl = "/images/products/bow-keycaps.jpg",
                            Alt = "GMK Olivia++ keycaps",
                            DisplayOrder = 1,
                            CreatedAt = DateTime.UtcNow
                        }
                    },
                    CreatedAt = DateTime.UtcNow
                }
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
    }
}
