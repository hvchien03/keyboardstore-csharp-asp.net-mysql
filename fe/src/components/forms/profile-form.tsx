"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@/types/api";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [email, setEmail] = useState(user.email);
  const [isPending, setIsPending] = useState(false);

  async function updateProfile() {
    setIsPending(true);
    try {
      const res = await fetch("/api/user/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success("Da cap nhat ho so");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the cap nhat");
    } finally {
      setIsPending(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-label-bold font-semibold text-on-surface">
          Email
        </span>
        <input
          className="w-full rounded-lg border border-border-subtle bg-surface-white px-4 py-3 outline-none focus:border-primary-container"
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          value={email}
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded bg-primary-container px-6 py-3 text-label-bold font-semibold text-on-primary disabled:opacity-60"
          disabled={isPending}
          onClick={updateProfile}
          type="button"
        >
          Luu thay doi
        </button>
        <button
          className="rounded border border-on-surface px-6 py-3 text-label-bold font-semibold text-on-surface"
          onClick={logout}
          type="button"
        >
          Dang xuat
        </button>
      </div>
    </div>
  );
}
