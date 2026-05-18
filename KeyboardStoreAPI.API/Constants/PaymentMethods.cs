namespace KeyboardStoreAPI.API.Constants
{
    public static class PaymentMethods
    {
        public const string COD = "COD";
        public const string VNPay = "VNPay";

        public static readonly string[] ValidMethods =
        {
            COD,
            VNPay
        };

        public static bool IsValid(string paymentMethod)
        {
            return ValidMethods.Contains(paymentMethod);
        }
    }
}
