using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            // Seed Categories
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category
                    {
                        Name = "Mechanical Keyboards",
                        Description = "High-quality mechanical keyboards for gaming and typing"
                    },
                    new Category
                    {
                        Name = "Keycaps",
                        Description = "Custom keycaps for mechanical keyboards"
                    },
                    new Category
                    {
                        Name = "Switches",
                        Description = "Mechanical keyboard switches"
                    },
                    new Category
                    {
                        Name = "Accessories",
                        Description = "Keyboard accessories and tools"
                    }
                };

                context.Categories.AddRange(categories);
                await context.SaveChangesAsync();
            }

            // Seed Admin User
            if (!context.Users.Any(u => u.Email == "admin@keyboardstore.com"))
            {
                var adminUser = new User
                {
                    Email = "admin@keyboardstore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }

            // Seed Sample Products
            if (!context.Products.Any())
            {
                var mechanicalCategory = context.Categories.First(c => c.Name == "Mechanical Keyboards");
                var keycapsCategory = context.Categories.First(c => c.Name == "Keycaps");

                var products = new List<Product>
                {
                    new Product
                    {
                        Name = "Keychron K2 V2",
                        Description = "Wireless mechanical keyboard with hot-swappable switches",
                        Price = 2400000m,
                        Stock = 50,
                        CategoryId = mechanicalCategory.Id,
                        ImageUrl = "https://example.com/keychron-k2.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {
                        Name = "Royal Kludge RK61",
                        Description = "Compact 60% mechanical keyboard",
                        Price = 1600000m,
                        Stock = 30,
                        CategoryId = mechanicalCategory.Id,
                        ImageUrl = "https://example.com/rk61.jpg",
                        CreatedAt = DateTime.UtcNow
                    },
                    new Product
                    {
                        Name = "GMK Olivia++ Keycaps",
                        Description = "Premium PBT keycap set",
                        Price = 3200000m,
                        Stock = 15,
                        CategoryId = keycapsCategory.Id,
                        ImageUrl = "https://example.com/gmk-olivia.jpg",
                        CreatedAt = DateTime.UtcNow
                    }
                };

                context.Products.AddRange(products);
                await context.SaveChangesAsync();
            }
        }
    }
}
