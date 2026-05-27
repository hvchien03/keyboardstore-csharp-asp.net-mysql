namespace KeyboardStoreAPI.API.Models.QueryParams
{
    public class ProductFilterParams : PaginationParams
    {
        public string? Keyword { get; set; }
        public int? CategoryId { get; set; }
        public int? BrandId { get; set; }
        public int? SwitchTypeId { get; set; }
        public int? LayoutId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? InStock { get; set; }
        public string? SortBy { get; set; }
    }
}
