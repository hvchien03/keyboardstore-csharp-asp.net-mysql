import { MailCheck } from "lucide-react";
import Link from "next/link";
import { ResendVerificationForm } from "@/components/forms/resend-verification-form";

export default async function VerifyEmailPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-container-max flex-grow items-center justify-center px-margin-mobile py-section-padding">
      <section className="w-full max-w-lg rounded-lg border border-border-subtle bg-surface-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <MailCheck className="mx-auto mb-5 h-14 w-14 text-primary-container" />
        <h1 className="mb-3 text-headline-md font-semibold text-on-surface">
          Kiem tra email de xac minh tai khoan
        </h1>
        <p className="text-body-md text-secondary">
          Tai khoan da duoc tao nhung chua duoc cap token. Ban can bam link xac
          minh trong email roi moi dang nhap duoc.
        </p>
        {email ? (
          <p className="mt-4 rounded bg-surface-container-low px-4 py-3 text-body-md text-on-surface">
            {email}
          </p>
        ) : null}
        <ResendVerificationForm email={email} />
        <Link
          className="mt-5 inline-flex text-label-bold font-semibold text-primary-container hover:underline"
          href="/login"
        >
          Quay lai dang nhap
        </Link>
      </section>
    </main>
  );
}
