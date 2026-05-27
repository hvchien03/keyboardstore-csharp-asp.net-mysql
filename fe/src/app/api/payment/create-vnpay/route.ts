import { NextRequest, NextResponse } from "next/server";
import { apiFetch, toErrorResponse } from "@/lib/server-api";
import type { VNPayPayment } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const orderDto = await req.json();
    const payment = await apiFetch<VNPayPayment>(
      "/api/Payment/create-vnpay-payment",
      {
        auth: true,
        method: "POST",
        body: JSON.stringify({ orderDto }),
      },
    );

    return NextResponse.json({ success: true, data: payment });
  } catch (error) {
    return toErrorResponse(error);
  }
}
