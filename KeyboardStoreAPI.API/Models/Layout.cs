namespace KeyboardStoreAPI.API.Models
{
    public class Layout
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Percentage { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
