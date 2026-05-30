import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await apiFetch<{ message: string }>(
      "/api/Auth/resend-verification-email",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    return toErrorResponse(error);
  }
}
