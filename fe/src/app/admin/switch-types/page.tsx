import { redirect } from "next/navigation";
import {
  DeleteSwitchTypeButton,
  SwitchTypeAdminForm,
  SwitchTypeEditDialogButton,
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
import type { SwitchType } from "@/types/api";

export default async function AdminSwitchTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  let switchTypes: SwitchType[] = [];
  try {
    switchTypes = await apiFetch<SwitchType[]>("/api/SwitchType", {
      auth: true,
    });
  } catch {
    redirect("/login");
  }

  const keyword = getSearchValue(q);
  const filtered = keyword
    ? switchTypes.filter((switchType) =>
        `${switchType.name} ${switchType.description}`.toLowerCase().includes(keyword),
      )
    : switchTypes;
  const paged = paginateAdminList(filtered, page);

  return (
    <AdminShell title="Switch Types">
      <AdminSectionHeader eyebrow="Keyboard specs" title="Switch Type Management" />
      <SwitchTypeAdminForm />
      <AdminSearchForm action="/admin/switch-types" placeholder="Tim switch type..." q={q} />
      <AdminListCount count={paged.data.length} total={paged.totalCount} />

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {paged.data.map((switchType) => (
          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-4 md:grid-cols-[1fr_2fr_130px] md:items-center" key={switchType.id}>
            <h2 className="font-bold text-slate-950">{switchType.name}</h2>
            <p className="text-sm text-slate-600">{switchType.description}</p>
            <div className="flex gap-2">
              <SwitchTypeEditDialogButton switchType={switchType} />
              <DeleteSwitchTypeButton id={switchType.id} />
            </div>
          </div>
        ))}
      </div>
      <Pagination basePath="/admin/switch-types" currentPage={paged.page} searchParams={{ q }} totalPages={paged.totalPages} />
    </AdminShell>
  );
}
