import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, toErrorResponse } from "@/lib/server-api";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5143";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const formData = await req.formData();
    const res = await fetch(`${API_BASE_URL}/api/Product/${id}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });
    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: json.message ?? "Upload failed" },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, data: json });
  } catch (error) {
    return toErrorResponse(error);
  }
}
