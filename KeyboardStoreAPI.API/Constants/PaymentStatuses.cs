namespace KeyboardStoreAPI.API.Constants
{
    public static class PaymentStatuses
    {
        public const string Unpaid = "Unpaid";
        public const string Paid = "Paid";
        public const string Failed = "Failed";

        public static readonly string[] ValidStatuses =
        {
            Unpaid,
            Paid,
            Failed
        };

        public static bool IsValid(string paymentStatus)
        {
            return ValidStatuses.Contains(paymentStatus);
        }
    }
}
