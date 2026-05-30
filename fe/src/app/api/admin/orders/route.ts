import { NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Order } from "@/types/api";

export async function GET() {
  try {
    const orders = await apiFetch<Order[]>("/api/Order/admin", { auth: true });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return toErrorResponse(error);
  }
}
