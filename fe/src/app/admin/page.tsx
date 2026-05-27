import { Boxes, FolderTree, PackageCheck, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { Category, Order, Product, User } from "@/types/api";

export default async function AdminPage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let orders: Order[] = [];
  let users: User[] = [];

  try {
    products = await apiFetch<Product[]>("/api/Product", { auth: true });
    categories = await apiFetch<Category[]>("/api/Category", { auth: true });
    orders = await apiFetch<Order[]>("/api/Order/admin", { auth: true });
    users = await apiFetch<User[]>("/api/User", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <AdminShell title="Admin Dashboard">
      <div className="grid gap-gutter md:grid-cols-4">
        <AdminStat href="/admin/products" icon={<Boxes />} label="Products" value={products.length} />
        <AdminStat href="/admin/categories" icon={<FolderTree />} label="Categories" value={categories.length} />
        <AdminStat href="/admin/orders" icon={<PackageCheck />} label="Orders" value={orders.length} />
        <AdminStat href="/admin/users" icon={<Users />} label="Users" value={users.length} />
      </div>
      <section className="mt-gutter rounded-lg border border-border-subtle bg-surface-white p-6">
        <h2 className="mb-4 text-headline-md font-semibold">Don hang moi</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div className="flex justify-between border-b border-border-subtle pb-3" key={order.id}>
              <span>#{order.id} · {order.userEmail}</span>
              <span>{order.status}</span>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}

function AdminStat({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Link className="rounded-lg border border-border-subtle bg-surface-white p-6 transition-all hover:-translate-y-[2px]" href={href}>
      <div className="mb-4 text-primary-container">{icon}</div>
      <p className="text-label-sm uppercase tracking-wide text-secondary">{label}</p>
      <p className="mt-2 text-headline-md font-semibold">{value}</p>
    </Link>
  );
}
