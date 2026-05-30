import { redirect } from "next/navigation";
import {
  CategoryAdminForm,
  CategoryEditDialogButton,
  DeleteCategoryButton,
} from "@/components/admin/admin-actions";
import { AdminListCount, AdminSearchForm, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { getSearchValue, paginateAdminList } from "@/lib/admin-list";
import { apiFetch } from "@/lib/server-api";
import type { Category } from "@/types/api";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  let categories: Category[] = [];
  try {
    categories = await apiFetch<Category[]>("/api/Category", { auth: true });
  } catch {
    redirect("/login");
  }

  const keyword = getSearchValue(q);
  const filtered = keyword
    ? categories.filter((category) =>
        `${category.name} ${category.description}`.toLowerCase().includes(keyword),
      )
    : categories;
  const paged = paginateAdminList(filtered, page, 10);

  return (
    <AdminShell title="Categories">
      <AdminSectionHeader eyebrow="Catalog" title="Category Management" />
      <CategoryAdminForm />

      <AdminSearchForm action="/admin/categories" placeholder="Tim danh muc..." q={q} />
      <AdminListCount count={paged.data.length} total={paged.totalCount} />

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {paged.data.map((category) => (
          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-4 md:grid-cols-[1fr_2fr_130px] md:items-center" key={category.id}>
            <h2 className="font-bold text-slate-950">{category.name}</h2>
            <p className="text-sm text-slate-600">{category.description}</p>
            <div className="flex gap-2">
              <CategoryEditDialogButton category={category} />
              <DeleteCategoryButton id={category.id} />
            </div>
          </div>
        ))}
      </div>
      <Pagination basePath="/admin/categories" currentPage={paged.page} searchParams={{ q }} totalPages={paged.totalPages} />
    </AdminShell>
  );
}
