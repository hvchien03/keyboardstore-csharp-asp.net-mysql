import { NextResponse } from "next/server";
import { clearAuthCookies, getRefreshToken } from "@/lib/server-api";
import { apiFetch } from "@/lib/server-api";

export async function POST() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await apiFetch("/api/Auth/logout", {
        auth: true,
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Cookie cleanup should still happen when backend token is already invalid.
    }
  }

  await clearAuthCookies();
  return NextResponse.json({ success: true });
}
