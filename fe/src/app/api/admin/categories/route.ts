import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { Category } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const category = await apiFetch<Category>("/api/Category", {
      auth: true,
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return toErrorResponse(error);
  }
}
