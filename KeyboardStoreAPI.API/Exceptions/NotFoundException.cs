namespace KeyboardStoreAPI.API.Exceptions
{
    // Lỗi khi không tìm thấy resource (404)
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message)
        {
        }
    }
}