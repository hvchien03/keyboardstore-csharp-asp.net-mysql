import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Dang nhap",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow items-center justify-center px-margin-mobile py-section-padding">
      <section className="w-full max-w-md rounded-lg border border-border-subtle bg-surface-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <h1 className="mb-2 text-headline-md font-semibold text-on-surface">
          Đăng nhập
        </h1>
        <p className="mb-8 text-body-md text-secondary">
          Truy cập giở hàng, đơn hàng và hồ sơ KEYFRAME của bạn.
        </p>

        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-body-sm text-amber-900">
          <p className="font-semibold">Tài khoản demo</p>
          <p className="mt-1">Email: demo@keyboardstore.com</p>
          <p className="mt-1">Mật khẩu: demo123</p>
        </div>

        <AuthForm mode="login" />
      </section>
    </main>
  );
}
