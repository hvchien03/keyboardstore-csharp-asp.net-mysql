import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Cart } from "@/types/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    const body = await req.json();
    const cart = await apiFetch<Cart>(`/api/Cart/items/${productId}`, {
      auth: true,
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const { productId } = await params;
    await apiFetch(`/api/Cart/items/${productId}`, {
      auth: true,
      method: "DELETE",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
