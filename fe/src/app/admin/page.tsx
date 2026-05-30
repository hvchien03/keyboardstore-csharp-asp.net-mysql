import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  PackageCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminEmptyState, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { formatCurrency } from "@/lib/format";
import { apiFetch } from "@/lib/server-api";
import type { Order, Product, User } from "@/types/api";

export default async function AdminPage() {
  let products: Product[] = [];
  let orders: Order[] = [];
  let users: User[] = [];

  try {
    products = await apiFetch<Product[]>("/api/Product", { auth: true });
    orders = await apiFetch<Order[]>("/api/Order/admin", { auth: true });
    users = await apiFetch<User[]>("/api/User", { auth: true });
  } catch {
    redirect("/login");
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const createdDiff =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return createdDiff || b.id - a.id;
  });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const completedOrders = orders.filter((order) => order.status === "Completed").length;
  const activeNow = orders.filter((order) =>
    ["Pending", "Processing", "Shipped"].includes(order.status),
  ).length;
  const topProducts = getTopProducts(orders, products);
  const chartData = getRevenueTrend(orders);

  return (
    <AdminShell title="Dashboard">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          href="/admin/orders"
          icon={<CreditCard size={20} />}
          label="Total Revenue"
          trend="12.4%"
          value={formatCurrency(totalRevenue)}
        />
        <KpiCard
          href="/admin/orders"
          icon={<PackageCheck size={20} />}
          label="Total Orders"
          trend={`${completedOrders} completed`}
          value={orders.length.toLocaleString("vi-VN")}
        />
        <KpiCard
          href="/admin/users"
          icon={<Users size={20} />}
          label="Total Customers"
          trend="managed users"
          value={users.length.toLocaleString("vi-VN")}
        />
        <KpiCard
          href="/admin/products"
          icon={<Zap size={20} />}
          label="Active Now"
          trend="open workflows"
          value={activeNow.toLocaleString("vi-VN")}
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <AdminSectionHeader eyebrow="Revenue" title="Sales Overview" />
          <RevenueChart data={chartData} />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <AdminSectionHeader
            action={
              <Link className="text-sm font-semibold text-emerald-600" href="/admin/products">
                View all
              </Link>
            }
            eyebrow="Catalog"
            title="Top Products"
          />
          <div className="space-y-4">
            {topProducts.length ? (
              topProducts.map((item, index) => (
                <div className="flex items-center justify-between gap-4" key={item.name}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.quantity} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <AdminEmptyState label="No sales data yet." />
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <AdminSectionHeader
          action={
            <Link className="text-sm font-semibold text-emerald-600" href="/admin/orders">
              Manage orders
            </Link>
          }
          eyebrow="Fulfillment"
          title="Recent Orders"
        />
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="grid grid-cols-[110px_1fr_130px_150px_130px] bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            <span>Order</span>
            <span>Customer</span>
            <span>Date</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {sortedOrders.slice(0, 8).map((order) => (
            <div
              className="grid grid-cols-[110px_1fr_130px_150px_130px] items-center border-t border-slate-200 px-4 py-4 text-sm hover:bg-slate-50"
              key={order.id}
            >
              <span className="font-bold text-slate-950">#{order.id}</span>
              <span className="text-slate-600">{order.userEmail}</span>
              <span className="text-slate-500">
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </span>
              <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
              <StatusBadge status={order.status} />
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function KpiCard({
  href,
  icon,
  label,
  trend,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  trend: string;
  value: string;
}) {
  return (
    <Link
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      href={href}
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">{icon}</span>
        <ArrowUpRight className="text-emerald-500" size={18} />
      </div>
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-3 flex items-center gap-1 text-sm text-slate-500">
        <ArrowDownRight size={14} />
        {trend}
      </p>
    </Link>
  );
}

function RevenueChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data
    .map((item, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * 760 + 20;
      const y = 230 - (item.value / max) * 180;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-[280px]">
      <svg className="h-full w-full" viewBox="0 0 800 280" role="img" aria-label="Revenue trend chart">
        <defs>
          <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[50, 110, 170, 230].map((y) => (
          <line key={y} x1="20" x2="780" y1={y} y2={y} stroke="#e2e8f0" />
        ))}
        <polyline
          fill="none"
          points={points}
          stroke="#10b981"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
        <polygon fill="url(#revenueFill)" points={`20,230 ${points} 780,230`} />
        {data.map((item, index) => (
          <text fill="#64748b" fontSize="12" key={item.label} x={(index / Math.max(data.length - 1, 1)) * 760 + 20} y="268">
            {item.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Completed"
      ? "bg-emerald-50 text-emerald-700"
      : status === "Cancelled"
        ? "bg-red-50 text-red-700"
        : "bg-amber-50 text-amber-700";

  return (
    <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${tone}`}>
      {status}
    </span>
  );
}

function getRevenueTrend(orders: Order[]) {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const buckets = new Map<string, number>();

  orders.forEach((order) => {
    const label = formatter.format(new Date(order.createdAt));
    buckets.set(label, (buckets.get(label) ?? 0) + order.totalAmount);
  });

  const data = Array.from(buckets.entries()).map(([label, value]) => ({ label, value }));
  return data.length ? data.slice(-6) : [{ label: "Now", value: 0 }];
}

function getTopProducts(orders: Order[], products: Product[]) {
  const byId = new Map(products.map((product) => [product.id, product.name]));
  const totals = new Map<number, { name: string; quantity: number; revenue: number }>();

  orders.forEach((order) => {
    order.orderDetails.forEach((item) => {
      const existing = totals.get(item.productId) ?? {
        name: byId.get(item.productId) ?? item.productName,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += item.quantity;
      existing.revenue += item.subtotal;
      totals.set(item.productId, existing);
    });
  });

  return Array.from(totals.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}
