using KeyboardStoreAPI.API.Data.Seeders;

namespace KeyboardStoreAPI.API.Data
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            await CategorySeeder.SeedAsync(context);
            await CatalogSeeder.SeedAsync(context);
            await UserSeeder.SeedAsync(context);
            await ProductSeeder.SeedAsync(context);
        }
    }
}
