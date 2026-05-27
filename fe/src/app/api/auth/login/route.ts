import { NextRequest, NextResponse } from "next/server";
import { apiFetch, setAuthCookies, toErrorResponse } from "@/lib/server-api";
import type { AuthResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const auth = await apiFetch<AuthResponse>("/api/Auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    await setAuthCookies(auth.token, auth.refreshToken);

    return NextResponse.json({
      success: true,
      data: { email: auth.email, role: auth.role, expiresAt: auth.expiresAt },
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
