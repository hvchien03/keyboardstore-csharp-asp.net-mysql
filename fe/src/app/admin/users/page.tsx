import { redirect } from "next/navigation";
import {
  AdminListCount,
  AdminSearchForm,
  AdminSectionHeader,
  AdminShell,
} from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { getSearchValue, paginateAdminList } from "@/lib/admin-list";
import { apiFetch } from "@/lib/server-api";
import type { User } from "@/types/api";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  let users: User[] = [];
  try {
    users = await apiFetch<User[]>("/api/User", { auth: true });
  } catch {
    redirect("/login");
  }

  const keyword = getSearchValue(q);
  const filtered = keyword
    ? users.filter((user) =>
        `#${user.id} ${user.email} ${user.role}`.toLowerCase().includes(keyword),
      )
    : users;
  const paged = paginateAdminList(filtered, page);

  return (
    <AdminShell title="Users">
      <AdminSectionHeader eyebrow="Accounts" title="User Management" />
      <AdminSearchForm action="/admin/users" placeholder="Tim email, id, role..." q={q} />
      <AdminListCount count={paged.data.length} total={paged.totalCount} />

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {paged.data.map((user) => (
          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-4 md:grid-cols-[90px_1fr_160px_120px] md:items-center" key={user.id}>
            <span>#{user.id}</span>
            <span className="font-semibold text-slate-950">{user.email}</span>
            <span>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-center text-sm font-bold text-slate-700">
              {user.role}
            </span>
          </div>
        ))}
      </div>
      <Pagination basePath="/admin/users" currentPage={paged.page} searchParams={{ q }} totalPages={paged.totalPages} />
    </AdminShell>
  );
}
