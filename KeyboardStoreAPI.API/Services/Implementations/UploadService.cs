using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Services.Interfaces;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class UploadService : IUploadService
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024;

        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _environment;

        public UploadService(
            IConfiguration configuration,
            IWebHostEnvironment environment)
        {
            _configuration = configuration;
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

            var uploadFolder = GetProductUploadFolder();

            Directory.CreateDirectory(uploadFolder);

            var fileName = $"{Guid.NewGuid():N}{extension}";
            var filePath = Path.Combine(uploadFolder, fileName);

            await using var stream = File.Create(filePath);
            await file.CopyToAsync(stream);

            return $"{GetUploadRequestPath()}/{GetProductFolderName()}/{fileName}";
        }

        public Task DeleteProductImageAsync(string imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return Task.CompletedTask;
            }

            var uploadUrlPrefix = $"{GetUploadRequestPath()}/{GetProductFolderName()}/";
            if (!imageUrl.StartsWith(uploadUrlPrefix, StringComparison.OrdinalIgnoreCase))
            {
                return Task.CompletedTask;
            }

            var fileName = Path.GetFileName(imageUrl);
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return Task.CompletedTask;
            }

            var uploadFolder = GetProductUploadFolder();
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

        private string GetProductUploadFolder()
        {
            return Path.Combine(GetUploadRootPath(), GetProductFolderName());
        }

        private string GetUploadRootPath()
        {
            var configuredRootPath = _configuration["UploadSettings:RootPath"];
            if (!string.IsNullOrWhiteSpace(configuredRootPath))
            {
                return Path.IsPathRooted(configuredRootPath)
                    ? configuredRootPath
                    : Path.Combine(_environment.ContentRootPath, configuredRootPath);
            }

            var webRootPath = _environment.WebRootPath
                ?? Path.Combine(_environment.ContentRootPath, "wwwroot");

            return Path.Combine(webRootPath, GetUploadRequestPath().Trim('/'));
        }

        private string GetUploadRequestPath()
        {
            var requestPath = _configuration["UploadSettings:RequestPath"] ?? "/uploads";

            return $"/{requestPath.Trim('/')}";
        }

        private string GetProductFolderName()
        {
            return _configuration["UploadSettings:ProductFolder"] ?? "products";
        }
    }
}
