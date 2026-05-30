import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/server-api";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;
  let isSuccess = false;
  let message = "Lien ket xac minh khong hop le.";

  if (email && token) {
    const params = new URLSearchParams({ email, token });

    try {
      await apiFetch<{ message: string }>(`/api/Auth/verify-email?${params}`);
      isSuccess = true;
      message = "Email da duoc xac minh. Ban co the dang nhap.";
    } catch (error) {
      message =
        error instanceof Error ? error.message : "Khong the xac minh email luc nay.";
    }
  }

  return (
    <main className="flex min-h-[70vh] flex-grow flex-col items-center justify-center gap-6 px-4 text-center">
      {isSuccess ? (
        <CheckCircle2 className="h-20 w-20 text-success-green" />
      ) : (
        <XCircle className="h-20 w-20 text-red-600" />
      )}
      <div>
        <h1 className="text-2xl font-bold">
          {isSuccess ? "Xac minh thanh cong" : "Xac minh that bai"}
        </h1>
        <p className="mt-2 text-secondary">{message}</p>
      </div>
      <Link
        className="rounded-md bg-primary-container px-5 py-2.5 text-sm font-medium text-on-primary"
        href={isSuccess ? "/login" : "/verify-email-pending"}
      >
        {isSuccess ? "Dang nhap" : "Gui lai email"}
      </Link>
    </main>
  );
}
