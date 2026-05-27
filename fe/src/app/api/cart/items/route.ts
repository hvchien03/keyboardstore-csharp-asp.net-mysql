import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Cart } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cart = await apiFetch<Cart>("/api/Cart/items", {
      auth: true,
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    return toErrorResponse(error);
  }
}
