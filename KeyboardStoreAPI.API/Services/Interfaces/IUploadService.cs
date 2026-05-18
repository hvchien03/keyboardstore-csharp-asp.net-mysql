namespace KeyboardStoreAPI.API.Services.Interfaces
{
    public interface IUploadService
    {
        Task<string> UploadProductImageAsync(IFormFile file);
    }
}
