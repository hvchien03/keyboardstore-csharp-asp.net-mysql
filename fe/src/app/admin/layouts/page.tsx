import { redirect } from "next/navigation";
import {
  DeleteLayoutButton,
  LayoutAdminForm,
  LayoutEditDialogButton,
} from "@/components/admin/admin-actions";
import {
  AdminListCount,
  AdminSearchForm,
  AdminSectionHeader,
  AdminShell,
} from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { getSearchValue, paginateAdminList } from "@/lib/admin-list";
import { apiFetch } from "@/lib/server-api";
import type { KeyboardLayout } from "@/types/api";

export default async function AdminLayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  let layouts: KeyboardLayout[] = [];
  try {
    layouts = await apiFetch<KeyboardLayout[]>("/api/Layout", { auth: true });
  } catch {
    redirect("/login");
  }

  const keyword = getSearchValue(q);
  const filtered = keyword
    ? layouts.filter((layout) =>
        `${layout.name} ${layout.percentage} ${layout.description}`.toLowerCase().includes(keyword),
      )
    : layouts;
  const paged = paginateAdminList(filtered, page);

  return (
    <AdminShell title="Layouts">
      <AdminSectionHeader eyebrow="Keyboard specs" title="Layout Management" />
      <LayoutAdminForm />
      <AdminSearchForm action="/admin/layouts" placeholder="Tim layout..." q={q} />
      <AdminListCount count={paged.data.length} total={paged.totalCount} />

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {paged.data.map((layout) => (
          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-4 md:grid-cols-[1fr_120px_2fr_130px] md:items-center" key={layout.id}>
            <h2 className="font-bold text-slate-950">{layout.name}</h2>
            <span className="text-sm font-semibold text-emerald-700">{layout.percentage}%</span>
            <p className="text-sm text-slate-600">{layout.description}</p>
            <div className="flex gap-2">
              <LayoutEditDialogButton layout={layout} />
              <DeleteLayoutButton id={layout.id} />
            </div>
          </div>
        ))}
      </div>
      <Pagination basePath="/admin/layouts" currentPage={paged.page} searchParams={{ q }} totalPages={paged.totalPages} />
    </AdminShell>
  );
}
