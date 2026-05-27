namespace KeyboardStoreAPI.API.Data.Seeders
{
    public static class CategorySeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (context.Categories.Any())
            {
                return;
            }

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
    }
}
