namespace KeyboardStoreAPI.API.Models.QueryParams
{
    public class OrderFilterParams : PaginationParams
    {
        public int? UserId { get; set; }
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
