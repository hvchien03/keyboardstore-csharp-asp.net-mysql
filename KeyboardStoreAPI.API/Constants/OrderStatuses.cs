namespace KeyboardStoreAPI.API.Constants
{
    public static class OrderStatuses
    {
        public const string Pending = "Pending";
        public const string PendingPayment = "Pending Payment";
        public const string Processing = "Processing";
        public const string Shipped = "Shipped";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";

        public static readonly string[] ValidStatuses =
        {
            Pending,
            Processing,
            Shipped,
            Completed,
            Cancelled
        };

        public static bool IsValid(string status)
        {
            return ValidStatuses.Contains(status);
        }
    }
}
