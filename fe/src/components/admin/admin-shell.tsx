import {
  ArrowLeft,
  BarChart3,
  Boxes,
  Building2,
  Component,
  FolderTree,
  LayoutDashboard,
  PackageCheck,
  Search,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import Link from "next/link";
import { AdminLogoutButton, AdminNotificationBell } from "./admin-actions";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Boxes, label: "Products" },
  { href: "/admin/brands", icon: Building2, label: "Brands" },
  { href: "/admin/categories", icon: FolderTree, label: "Categories" },
  { href: "/admin/layouts", icon: Component, label: "Layouts" },
  { href: "/admin/switch-types", icon: SlidersHorizontal, label: "Switch Types" },
  { href: "/admin/orders", icon: PackageCheck, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#0f172a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-[#0f172a] text-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-white/10 px-6">
          <Link className="text-xl font-bold tracking-tight" href="/admin">
            Commerce Hub
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                href={item.href}
                key={item.href}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <Link
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
            href="/"
          >
            <Settings size={18} />
            Storefront
          </Link>
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Executive Precision
              </p>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="hidden min-w-[320px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
              <Search className="text-slate-400" size={18} />
              <span className="text-sm text-slate-500">Search orders, products, users...</span>
            </div>
            <div className="flex items-center gap-3">
              <AdminNotificationBell />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminSectionHeader({
  action,
  eyebrow,
  title,
}: {
  action?: React.ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function AdminEmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}

export function AdminSearchForm({
  action,
  placeholder,
  q,
}: {
  action: string;
  placeholder: string;
  q?: string;
}) {
  return (
    <form action={action} className="mt-6 flex flex-wrap gap-3" method="get">
      <input className="admin-input w-full max-w-lg" defaultValue={q} name="q" placeholder={placeholder} />
      <button className="rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
        Tim
      </button>
      <Link className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-950" href={action}>
        Xoa
      </Link>
    </form>
  );
}

export function AdminListCount({ count, total }: { count: number; total: number }) {
  return <div className="mt-4 text-sm font-medium text-slate-600">Hien thi {count} trong {total} muc</div>;
}

export function AdminBackLink({
  href,
  label = "Quay lai danh sach",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
      href={href}
    >
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}

export { BarChart3, Building2 };
