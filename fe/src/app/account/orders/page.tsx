import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { apiFetch } from "@/lib/server-api";
import type { Order } from "@/types/api";

export const metadata: Metadata = {
  title: "Don hang cua toi",
};

export default async function OrdersPage() {
  let orders: Order[];
  try {
    orders = await apiFetch<Order[]>("/api/Order/my-orders", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-section-padding md:px-gutter">
      <div className="mb-8">
        <h1 className="mb-2 text-headline-md font-bold text-on-surface">
          My Orders
        </h1>
        <p className="text-body-md text-secondary">
          Theo doi lich su mua hang va trang thai thanh toan.
        </p>
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto">
        {["All", "Processing", "Completed", "Cancelled"].map((status, index) => (
          <button
            className={
              index === 0
                ? "rounded-full border border-primary-container bg-primary-container px-4 py-2 text-label-bold font-semibold text-on-primary"
                : "rounded-full border border-border-subtle bg-surface-white px-4 py-2 text-label-bold font-semibold text-secondary"
            }
            key={status}
            type="button"
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-gutter">
        {orders.length === 0 ? (
          <div className="rounded-lg border border-border-subtle bg-surface-white p-10 text-center">
            <h2 className="mb-2 text-headline-md font-semibold">
              Chua co don hang
            </h2>
            <Link className="text-primary-container hover:underline" href="/products">
              Mua san pham dau tien
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <article
              className="rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
              key={order.id}
            >
              <div className="mb-4 flex flex-col justify-between gap-4 border-b border-border-subtle pb-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-body-lg font-semibold text-on-surface">
                    Order #{order.id}
                  </h2>
                  <p className="text-body-md text-secondary">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <span className="rounded-full bg-surface-container-low px-3 py-1 text-label-bold font-semibold text-on-surface">
                  {order.status} · {order.paymentStatus}
                </span>
              </div>
              <div className="mb-4 space-y-2">
                {order.orderDetails.slice(0, 2).map((item) => (
                  <div className="flex justify-between text-body-md" key={item.id}>
                    <span>
                      {item.productName} x{item.quantity}
                    </span>
                    <span>{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <span className="text-headline-md font-semibold text-on-surface">
                  {formatCurrency(order.totalAmount)}
                </span>
                <Link
                  className="rounded border border-[#191919] px-5 py-2 text-center text-label-bold font-semibold text-on-surface"
                  href={`/account/orders/${order.id}`}
                >
                  Xem chi tiet
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
