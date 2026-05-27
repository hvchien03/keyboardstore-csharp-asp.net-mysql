import { Calendar, Mail, Package, ShieldCheck, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/forms/profile-form";
import { apiFetch } from "@/lib/server-api";
import type { Order, User } from "@/types/api";

export const metadata: Metadata = {
  title: "Tai khoan",
};

export default async function AccountPage() {
  let user: User;
  let orders: Order[] = [];
  try {
    user = await apiFetch<User>("/api/User/me", { auth: true });
    orders = await apiFetch<Order[]>("/api/Order/my-orders", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-section-padding md:px-gutter">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-headline-md font-semibold text-on-surface">
            Tai khoan cua toi
          </h1>
          <p className="mt-2 text-body-md text-secondary">
            Quan ly ho so, don hang va tuy chon mua sam.
          </p>
        </div>
        <Link
          className="rounded border border-on-surface px-5 py-2 text-label-bold font-semibold text-on-surface"
          href="/account/orders"
        >
          Xem don hang
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <aside className="rounded-lg border border-border-subtle bg-surface-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:col-span-3">
          <nav className="flex flex-col gap-1">
            <Link className="rounded bg-surface-container-low px-4 py-3 text-label-bold font-semibold text-primary-container" href="/account">
              Ho so
            </Link>
            <Link className="rounded px-4 py-3 text-label-bold font-semibold text-secondary hover:bg-surface-container-low" href="/account/orders">
              Don hang
            </Link>
          </nav>
        </aside>

        <section className="space-y-gutter md:col-span-9">
          <div className="flex flex-col items-center gap-8 overflow-hidden rounded-lg border border-border-subtle bg-surface-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface-white bg-surface-container-low shadow-sm">
              <UserRound size={42} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-headline-md font-semibold text-on-surface">
                {user.email}
              </h2>
              <p className="mt-2 text-body-md text-secondary">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
            <Stat icon={<Package />} label="Don hang" value={orders.length} />
            <Stat icon={<ShieldCheck />} label="Vai tro" value={user.role} />
            <Stat
              icon={<Calendar />}
              label="Thanh vien"
              value={new Date(user.createdAt).getFullYear()}
            />
          </div>

          <section className="rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-6 flex items-center gap-2 border-b border-border-subtle pb-4">
              <Mail className="text-primary-container" size={20} />
              <h3 className="text-label-bold font-semibold uppercase tracking-wide text-on-surface">
                Thong tin lien he
              </h3>
            </div>
            <ProfileForm user={user} />
          </section>
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="mb-4 text-primary-container">{icon}</div>
      <p className="text-label-sm font-medium uppercase tracking-wide text-secondary">
        {label}
      </p>
      <p className="mt-2 text-headline-md font-semibold text-on-surface">
        {value}
      </p>
    </div>
  );
}
