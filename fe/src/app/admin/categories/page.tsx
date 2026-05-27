import { redirect } from "next/navigation";
import { CategoryAdminForm, DeleteCategoryButton } from "@/components/admin/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { Category } from "@/types/api";

export default async function AdminCategoriesPage() {
  let categories: Category[] = [];
  try {
    categories = await apiFetch<Category[]>("/api/Category", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <AdminShell title="Categories">
      <CategoryAdminForm />
      <div className="mt-gutter overflow-hidden rounded-lg border border-border-subtle bg-surface-white">
        {categories.map((category) => (
          <div className="grid grid-cols-1 gap-4 border-b border-border-subtle p-4 md:grid-cols-[1fr_2fr_80px] md:items-center" key={category.id}>
            <h2 className="font-semibold">{category.name}</h2>
            <p className="text-secondary">{category.description}</p>
            <DeleteCategoryButton id={category.id} />
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
