import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    const token = req.nextUrl.searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: "Missing verification email or token" },
        { status: 400 },
      );
    }

    const params = new URLSearchParams({ email, token });
    const res = await apiFetch<{ message: string }>(
      `/api/Auth/verify-email?${params.toString()}`,
    );

    return NextResponse.json({ success: true, data: res });
  } catch (error) {
    return toErrorResponse(error);
  }
}
