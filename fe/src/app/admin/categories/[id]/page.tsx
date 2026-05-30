import { notFound, redirect } from "next/navigation";
import { CategoryEditForm } from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { Category } from "@/types/api";

export default async function AdminCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let category: Category | null = null;

  try {
    category = await apiFetch<Category>(`/api/Category/${id}`, { auth: true });
  } catch {
    redirect("/login");
  }

  if (!category) notFound();

  return (
    <AdminShell title="Update Category">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/categories" />}
        eyebrow="Catalog"
        title={category.name}
      />
      <CategoryEditForm category={category} />
    </AdminShell>
  );
}
