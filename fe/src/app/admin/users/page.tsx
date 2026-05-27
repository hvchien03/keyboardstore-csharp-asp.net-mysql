import { redirect } from "next/navigation";
import { UserRoleSelect } from "@/components/admin/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { User } from "@/types/api";

export default async function AdminUsersPage() {
  let users: User[] = [];
  try {
    users = await apiFetch<User[]>("/api/User", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <AdminShell title="Users">
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-surface-white">
        {users.map((user) => (
          <div className="grid grid-cols-1 gap-4 border-b border-border-subtle p-4 md:grid-cols-[90px_1fr_160px_120px] md:items-center" key={user.id}>
            <span>#{user.id}</span>
            <span>{user.email}</span>
            <span>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
            <UserRoleSelect userId={user.id} value={user.role} />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
