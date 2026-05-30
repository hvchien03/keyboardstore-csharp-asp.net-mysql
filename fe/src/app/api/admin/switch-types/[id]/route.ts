import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { SwitchType } from "@/types/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const switchType = await apiFetch<SwitchType>(`/api/SwitchType/${id}`, {
      auth: true,
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: switchType });
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
    await apiFetch(`/api/SwitchType/${id}`, { auth: true, method: "DELETE" });
    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
