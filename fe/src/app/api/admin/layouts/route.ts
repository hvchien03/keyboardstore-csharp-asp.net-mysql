import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { KeyboardLayout } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const layout = await apiFetch<KeyboardLayout>("/api/Layout", {
      auth: true,
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data: layout });
  } catch (error) {
    return toErrorResponse(error);
  }
}
