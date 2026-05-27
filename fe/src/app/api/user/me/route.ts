import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { User } from "@/types/api";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await apiFetch<User>("/api/User/me", {
      auth: true,
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
