namespace KeyboardStoreAPI.API.DTOs.Layout
{
    public class LayoutDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Percentage { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
