namespace KeyboardStoreAPI.API.Data.Seeders
{
    public static class CatalogSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await SeedBrandsAsync(context);
            await SeedSwitchTypesAsync(context);
            await SeedLayoutsAsync(context);
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
