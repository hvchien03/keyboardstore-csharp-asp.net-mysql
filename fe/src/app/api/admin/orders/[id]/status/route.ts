import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Order } from "@/types/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const order = await apiFetch<Order>(`/api/Order/${id}/status`, {
      auth: true,
      method: "PATCH",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return toErrorResponse(error);
  }
}
