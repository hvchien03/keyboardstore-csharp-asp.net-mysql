import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Dang ky",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow items-center justify-center px-margin-mobile py-section-padding">
      <section className="w-full max-w-md rounded-lg border border-border-subtle bg-surface-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <h1 className="mb-2 text-headline-md font-semibold text-on-surface">
          Tao tai khoan
        </h1>
        <p className="mb-8 text-body-md text-secondary">
          Luu dia chi thanh toan va theo doi don hang nhanh hon.
        </p>
        <AuthForm mode="register" />
      </section>
    </main>
  );
}
