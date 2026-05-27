import { redirect } from "next/navigation";
import { OrderStatusSelect } from "@/components/admin/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatCurrency } from "@/lib/format";
import { apiFetch } from "@/lib/server-api";
import type { Order } from "@/types/api";

export default async function AdminOrdersPage() {
  let orders: Order[] = [];
  try {
    orders = await apiFetch<Order[]>("/api/Order/admin", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <AdminShell title="Orders">
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-white">
        {orders.map((order) => (
          <div className="grid grid-cols-1 gap-4 border-b border-border-subtle p-4 md:grid-cols-[90px_1fr_130px_170px_150px] md:items-center" key={order.id}>
            <span className="font-semibold">#{order.id}</span>
            <span>{order.userEmail}</span>
            <span>{formatCurrency(order.totalAmount)}</span>
            <span>{order.paymentMethod} · {order.paymentStatus}</span>
            <OrderStatusSelect orderId={order.id} value={order.status} />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
