import { notFound, redirect } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { formatCurrency } from "@/lib/format";
import { apiFetch } from "@/lib/server-api";
import type { Order } from "@/types/api";

export default async function AdminOrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: Order | null = null;

  try {
    order = await apiFetch<Order>(`/api/Order/admin/${id}`, { auth: true });
  } catch {
    redirect("/login");
  }

  if (!order) notFound();

  return (
    <AdminShell title="Update Order">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/orders" />}
        eyebrow="Fulfillment"
        title={`Order #${order.id}`}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Items</h2>
          <div className="overflow-hidden rounded-lg border border-slate-100">
            {order.orderDetails.map((item) => (
              <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 text-sm md:grid-cols-[1fr_80px_130px_130px]" key={item.id}>
                <span className="font-semibold text-slate-900">{item.productName}</span>
                <span>Qty {item.quantity}</span>
                <span>{formatCurrency(item.price)}</span>
                <span className="font-bold">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-950">Update Status</h2>
          <OrderStatusSelect orderId={order.id} value={order.status} />
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p><strong className="text-slate-950">Customer:</strong> {order.userEmail}</p>
            <p><strong className="text-slate-950">Total:</strong> {formatCurrency(order.totalAmount)}</p>
            <p><strong className="text-slate-950">Payment:</strong> {order.paymentMethod} / {order.paymentStatus}</p>
            <p><strong className="text-slate-950">Ship to:</strong> {order.shippingName}, {order.shippingPhone}</p>
            <p>{order.shippingAddress}</p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
