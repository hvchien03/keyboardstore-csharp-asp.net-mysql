"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ResendVerificationForm({ email }: { email?: string }) {
  const [value, setValue] = useState(email ?? "");
  const [isPending, setIsPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    try {
      const res = await fetch("/api/auth/resend-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Khong the gui lai email");
      }

      toast.success("Da gui lai email xac minh");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Co loi xay ra");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="mt-6 space-y-3" onSubmit={submit}>
      <label className="block text-left">
        <span className="mb-2 block text-label-bold font-semibold text-on-surface">
          Email
        </span>
        <input
          className="w-full rounded-lg border border-border-subtle bg-surface-white px-4 py-3 outline-none focus:border-primary-container"
          onChange={(event) => setValue(event.target.value)}
          type="email"
          value={value}
        />
      </label>
      <button
        className="w-full rounded-lg border border-on-surface px-5 py-3 text-label-bold font-semibold text-on-surface disabled:opacity-60"
        disabled={isPending || !value}
        type="submit"
      >
        Gui lai email xac minh
      </button>
    </form>
  );
}
