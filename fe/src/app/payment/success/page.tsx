import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <main className="flex min-h-[70vh] flex-grow flex-col items-center justify-center gap-6 px-4 text-center">
      <CheckCircle2 className="h-20 w-20 text-success-green" />
      <div>
        <h1 className="text-2xl font-bold">Thanh toan thanh cong!</h1>
        <p className="mt-2 text-secondary">
          Đơn hàng #{orderId ?? ""} của bạn đã được xác nhận.
        </p>
      </div>
      <div className="flex gap-3">
        {orderId ? (
          <Link
            className="rounded-md bg-primary-container px-5 py-2.5 text-sm font-medium text-on-primary"
            href={`/account/orders/${orderId}`}
          >
            Xem đơn hàng
          </Link>
        ) : null}
        <Link
          className="rounded-md border px-5 py-2.5 text-sm font-medium"
          href="/"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </main>
  );
}
