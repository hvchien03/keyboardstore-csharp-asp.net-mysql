import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Order } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await apiFetch<Order>("/api/Cart/checkout", {
      auth: true,
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return toErrorResponse(error);
  }
}
