import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Product } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await apiFetch<Product>("/api/Product", {
      auth: true,
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return toErrorResponse(error);
  }
}
