import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { apiFetch } from "@/lib/server-api";
import type { Order } from "@/types/api";

export const metadata: Metadata = {
  title: "Chi tiet don hang",
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { id } = await params;
  const { status } = await searchParams;
  let order: Order;

  try {
    order = await apiFetch<Order>(`/api/Order/${id}`, { auth: true });
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode;
    if (statusCode === 401) redirect("/login");
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-section-padding md:px-gutter">
      {status === "confirmed" ? (
        <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          Don hang da duoc tao thanh cong.
        </div>
      ) : null}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-headline-md font-bold text-on-surface">
            Order #{order.id}
          </h1>
          <p className="mt-2 text-body-md text-secondary">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <Link
          className="rounded border border-on-surface px-5 py-2 text-label-bold font-semibold text-on-surface"
          href="/account/orders"
        >
          Quay lai
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <section className="rounded-lg border border-border-subtle bg-surface-white p-6 lg:col-span-8">
          <h2 className="mb-6 text-headline-md font-semibold">San pham</h2>
          <div className="space-y-4">
            {order.orderDetails.map((item) => (
              <div className="flex justify-between border-b border-border-subtle pb-4" key={item.id}>
                <div>
                  <h3 className="text-body-lg font-semibold text-on-surface">
                    {item.productName}
                  </h3>
                  <p className="text-body-md text-secondary">
                    {formatCurrency(item.price)} x {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-gutter lg:col-span-4">
          <section className="rounded-lg border border-border-subtle bg-surface-white p-6">
            <h2 className="mb-4 text-headline-md font-semibold">Tong ket</h2>
            <Info label="Trang thai" value={order.status} />
            <Info label="Thanh toan" value={`${order.paymentMethod} · ${order.paymentStatus}`} />
            <Info label="Tong tien" value={formatCurrency(order.totalAmount)} />
          </section>
          <section className="rounded-lg border border-border-subtle bg-surface-white p-6">
            <h2 className="mb-4 text-headline-md font-semibold">Giao hang</h2>
            <Info label="Nguoi nhan" value={order.shippingName} />
            <Info label="Dien thoai" value={order.shippingPhone} />
            <Info label="Dia chi" value={order.shippingAddress} />
          </section>
        </aside>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 flex justify-between gap-4 text-body-md">
      <span className="text-secondary">{label}</span>
      <span className="text-right font-semibold text-on-surface">{value}</span>
    </div>
  );
}
