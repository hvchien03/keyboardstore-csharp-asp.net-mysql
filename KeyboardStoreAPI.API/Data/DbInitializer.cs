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

            await SeedBrandsAsync(context);
            await SeedSwitchTypesAsync(context);
            await SeedLayoutsAsync(context);

            // Seed Admin User
            if (!context.Users.Any(u => u.Email == "admin@keyboardstore.com"))
            {
                var adminUser = new User
                {
                    Email = "admin@keyboardstore.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    IsEmailVerified = true,
                    EmailVerifiedAt = DateTime.UtcNow,
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
                var keychronBrand = context.Brands.First(b => b.Name == "Keychron");
                var royalKludgeBrand = context.Brands.First(b => b.Name == "Royal Kludge");
                var gmkBrand = context.Brands.First(b => b.Name == "GMK");
                var brownSwitch = context.SwitchTypes.First(s => s.Name == "Clicky");
                var redSwitch = context.SwitchTypes.First(s => s.Name == "Linear");
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
                        SwitchTypeId = brownSwitch.Id,
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
                        SwitchTypeId = redSwitch.Id,
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

        private static async Task SeedBrandsAsync(ApplicationDbContext context)
        {
            var brands = new List<Brand>
            {
                new Brand
                {
                    Name = "Keychron",
                    Description = "Wireless mechanical keyboards and accessories",
                    CreatedAt = DateTime.UtcNow
                },
                new Brand
                {
                    Name = "Royal Kludge",
                    Description = "Affordable compact mechanical keyboards",
                    CreatedAt = DateTime.UtcNow
                },
                new Brand
                {
                    Name = "GMK",
                    Description = "Premium keycap sets",
                    CreatedAt = DateTime.UtcNow
                }
            };

            var existingBrandNames = context.Brands
                .Select(brand => brand.Name)
                .ToHashSet();
            var missingBrands = brands
                .Where(brand => !existingBrandNames.Contains(brand.Name))
                .ToList();

            if (missingBrands.Any())
            {
                context.Brands.AddRange(missingBrands);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedSwitchTypesAsync(ApplicationDbContext context)
        {
            var switchTypes = new List<SwitchType>
            {
                new SwitchType
                {
                    Name = "Linear",
                    Description = "Linear mechanical switch"
                },
                new SwitchType
                {
                    Name = "Tactile",
                    Description = "Tactile mechanical switch"
                },
                new SwitchType
                {
                    Name = "Clicky",
                    Description = "Clicky mechanical switch"
                }
            };

            var existingSwitchTypeNames = context.SwitchTypes
                .Select(switchType => switchType.Name)
                .ToHashSet();
            var missingSwitchTypes = switchTypes
                .Where(switchType => !existingSwitchTypeNames.Contains(switchType.Name))
                .ToList();

            if (missingSwitchTypes.Any())
            {
                context.SwitchTypes.AddRange(missingSwitchTypes);
                await context.SaveChangesAsync();
            }
        }

        private static async Task SeedLayoutsAsync(ApplicationDbContext context)
        {
            var layouts = new List<Layout>
            {
                new Layout
                {
                    Name = "60%",
                    Percentage = "60%",
                    Description = "Compact layout without function row and navigation cluster"
                },
                new Layout
                {
                    Name = "75%",
                    Percentage = "75%",
                    Description = "Compact layout with function row"
                },
                new Layout
                {
                    Name = "TKL",
                    Percentage = "80%",
                    Description = "Tenkeyless layout without numpad"
                }
            };

            var existingLayoutNames = context.Layouts
                .Select(layout => layout.Name)
                .ToHashSet();
            var missingLayouts = layouts
                .Where(layout => !existingLayoutNames.Contains(layout.Name))
                .ToList();

            if (missingLayouts.Any())
            {
                context.Layouts.AddRange(missingLayouts);
                await context.SaveChangesAsync();
            }
        }
    }
}
