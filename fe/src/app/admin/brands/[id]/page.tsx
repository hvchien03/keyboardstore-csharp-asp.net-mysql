import { notFound, redirect } from "next/navigation";
import { BrandEditForm } from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { Brand } from "@/types/api";

export default async function AdminBrandEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let brand: Brand | null = null;

  try {
    brand = await apiFetch<Brand>(`/api/Brand/${id}`, { auth: true });
  } catch {
    redirect("/login");
  }

  if (!brand) notFound();

  return (
    <AdminShell title="Update Brand">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/brands" />}
        eyebrow="Portfolio"
        title={brand.name}
      />
      <BrandEditForm brand={brand} />
    </AdminShell>
  );
}
