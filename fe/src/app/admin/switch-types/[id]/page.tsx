import { notFound, redirect } from "next/navigation";
import { SwitchTypeEditForm } from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { apiFetch } from "@/lib/server-api";
import type { SwitchType } from "@/types/api";

export default async function AdminSwitchTypeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let switchType: SwitchType | null = null;

  try {
    switchType = await apiFetch<SwitchType>(`/api/SwitchType/${id}`, {
      auth: true,
    });
  } catch {
    redirect("/login");
  }

  if (!switchType) notFound();

  return (
    <AdminShell title="Update Switch Type">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/switch-types" />}
        eyebrow="Keyboard specs"
        title={switchType.name}
      />
      <SwitchTypeEditForm switchType={switchType} />
    </AdminShell>
  );
}
