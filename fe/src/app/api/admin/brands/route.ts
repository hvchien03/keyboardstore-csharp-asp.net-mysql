import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Brand } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const brand = await apiFetch<Brand>("/api/Brand", {
      auth: true,
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: brand });
  } catch (error) {
    return toErrorResponse(error);
  }
}
