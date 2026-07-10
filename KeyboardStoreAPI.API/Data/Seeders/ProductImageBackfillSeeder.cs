using Microsoft.EntityFrameworkCore;

namespace KeyboardStoreAPI.API.Data.Seeders
{
    public static class ProductImageBackfillSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            var products = await context.Products
                .Include(product => product.ProductImages)
                .ToListAsync();

            var imageSourceByProductKey = products
                .Where(product => product.ProductImages.Any())
                .GroupBy(BuildProductKey)
                .ToDictionary(
                    group => group.Key,
                    group => group.OrderBy(product => product.CreatedAt).First());

            var imagesToCreate = new List<ProductImage>();

            foreach (var product in products.Where(product => !product.ProductImages.Any()))
            {
                var productKey = BuildProductKey(product);
                if (!imageSourceByProductKey.TryGetValue(productKey, out var imageSource)
                    || imageSource.Id == product.Id)
                {
                    continue;
                }

                imagesToCreate.AddRange(imageSource.ProductImages
                    .OrderBy(image => image.DisplayOrder)
                    .Select(image => new ProductImage
                    {
                        ProductId = product.Id,
                        ImageUrl = image.ImageUrl,
                        Alt = product.Name,
                        DisplayOrder = image.DisplayOrder,
                        CreatedAt = DateTime.UtcNow
                    }));
            }

            if (!imagesToCreate.Any())
            {
                return;
            }

            context.ProductImages.AddRange(imagesToCreate);
            await context.SaveChangesAsync();
        }

        private static string BuildProductKey(Product product)
        {
            return $"{product.Name.Trim().ToLowerInvariant()}|{product.BrandId}|{product.CategoryId}";
        }
    }
}
