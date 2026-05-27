using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class UploadService : IUploadService
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024;

        private readonly IWebHostEnvironment _environment;

        public UploadService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<string> UploadProductImageAsync(IFormFile file)
        {
            if (file.Length == 0)
            {
                throw new BadRequestException("File is empty");
            }

            if (file.Length > MaxFileSize)
            {
                throw new BadRequestException("File size must be 5MB or less");
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!AllowedExtensions.Contains(extension))
            {
                throw new BadRequestException("Only jpg, jpeg, png, and webp files are allowed");
            }

            var webRootPath = _environment.WebRootPath
                ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadFolder = Path.Combine(webRootPath, "uploads", "products");

            Directory.CreateDirectory(uploadFolder);

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            await using var stream = File.Create(filePath);
            await file.CopyToAsync(stream);

            return $"/uploads/products/{fileName}";
        }

        public Task DeleteProductImageAsync(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return Task.CompletedTask;
            }

            const string uploadUrlPrefix = "/uploads/products/";
            if (!imageUrl.StartsWith(uploadUrlPrefix, StringComparison.OrdinalIgnoreCase))
            {
                return Task.CompletedTask;
            }

            var fileName = Path.GetFileName(imageUrl);
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return Task.CompletedTask;
            }

            var webRootPath = _environment.WebRootPath
                ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadFolder = Path.Combine(webRootPath, "uploads", "products");
            var filePath = Path.Combine(uploadFolder, fileName);
            var fullUploadFolder = Path.GetFullPath(uploadFolder);
            var fullFilePath = Path.GetFullPath(filePath);

            if (!fullFilePath.StartsWith(fullUploadFolder, StringComparison.OrdinalIgnoreCase))
            {
                return Task.CompletedTask;
            }

            if (File.Exists(fullFilePath))
            {
                File.Delete(fullFilePath);
            }

            return Task.CompletedTask;
        }
    }
}
