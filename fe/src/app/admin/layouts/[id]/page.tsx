import { notFound, redirect } from "next/navigation";
import { LayoutEditForm } from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { KeyboardLayout } from "@/types/api";

export default async function AdminLayoutEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let layout: KeyboardLayout | null = null;

  try {
    layout = await apiFetch<KeyboardLayout>(`/api/Layout/${id}`, { auth: true });
  } catch {
    redirect("/login");
  }

  if (!layout) notFound();

  return (
    <AdminShell title="Update Layout">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/layouts" />}
        eyebrow="Keyboard specs"
        title={layout.name}
      />
      <LayoutEditForm layout={layout} />
    </AdminShell>
  );
}
