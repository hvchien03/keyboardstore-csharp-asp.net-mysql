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
          Dang nhap
        </h1>
        <p className="mb-8 text-body-md text-secondary">
          Truy cap gio hang, don hang va ho so KEYFRAME cua ban.
        </p>
        <AuthForm mode="login" />
      </section>
    </main>
  );
}
