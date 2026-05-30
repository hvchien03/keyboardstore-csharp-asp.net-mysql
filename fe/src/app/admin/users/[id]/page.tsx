import { notFound, redirect } from "next/navigation";
import { UserRoleSelect } from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { User } from "@/types/api";

export default async function AdminUserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let user: User | null = null;

  try {
    user = await apiFetch<User>(`/api/User/${id}`, { auth: true });
  } catch {
    redirect("/login");
  }

  if (!user) notFound();

  return (
    <AdminShell title="Update User">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/users" />}
        eyebrow="Accounts"
        title={user.email}
      />
      <section className="max-w-xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 space-y-2 text-sm text-slate-600">
          <p><strong className="text-slate-950">User ID:</strong> #{user.id}</p>
          <p><strong className="text-slate-950">Created:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}</p>
        </div>
        <label className="text-sm font-bold text-slate-950" htmlFor="role">
          Role
        </label>
        <div className="mt-2">
          <UserRoleSelect userId={user.id} value={user.role} />
        </div>
      </section>
    </AdminShell>
  );
}
