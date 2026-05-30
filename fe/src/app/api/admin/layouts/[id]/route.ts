import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { KeyboardLayout } from "@/types/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const layout = await apiFetch<KeyboardLayout>(`/api/Layout/${id}`, {
      auth: true,
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: layout });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await apiFetch(`/api/Layout/${id}`, { auth: true, method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
