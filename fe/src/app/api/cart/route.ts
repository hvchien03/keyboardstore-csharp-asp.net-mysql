import { NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Cart } from "@/types/api";

export async function GET() {
  try {
    const cart = await apiFetch<Cart>("/api/Cart", { auth: true });
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    return toErrorResponse(error);
  }
}
