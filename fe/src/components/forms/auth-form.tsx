"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { loginSchema, registerSchema } from "@/lib/validators";

type Mode = "login" | "register";
type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const schema = mode === "login" ? loginSchema : registerSchema;
  const form = useForm<LoginValues | RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "login"
        ? { email: "", password: "" }
        : { email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: LoginValues | RegisterValues) {
    setIsPending(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Khong the xac thuc");
      }

      if (mode === "register" && json.data?.requiresEmailVerification) {
        toast.success("Dang ky thanh cong. Vui long xac minh email.");
        router.push(
          `/verify-email-pending?email=${encodeURIComponent(json.data.email)}`,
        );
        return;
      }

      toast.success(mode === "login" ? "Dang nhap thanh cong" : "Dang ky thanh cong");
      router.push(json.data?.role === "Admin" ? "/admin" : "/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Co loi xay ra");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Field
        error={form.formState.errors.email?.message}
        label="Email"
        registration={form.register("email")}
        type="email"
      />
      <Field
        error={form.formState.errors.password?.message}
        label="Mat khau"
        registration={form.register("password")}
        type="password"
      />
      {mode === "register" ? (
        <Field
          error={(form.formState.errors as Record<string, { message?: string }>).confirmPassword?.message}
          label="Xac nhan mat khau"
          registration={form.register("confirmPassword" as never)}
          type="password"
        />
      ) : null}

      <button
        className="w-full rounded-lg bg-primary-container px-5 py-3 text-label-bold font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {mode === "login" ? "Dang nhap" : "Dang ky"}
      </button>

      <p className="text-center text-body-md text-secondary">
        {mode === "login" ? "Chua co tai khoan? " : "Da co tai khoan? "}
        <Link
          className="font-semibold text-primary-container hover:underline"
          href={mode === "login" ? "/register" : "/login"}
        >
          {mode === "login" ? "Dang ky" : "Dang nhap"}
        </Link>
      </p>
    </form>
  );
}

function Field({
  error,
  label,
  registration,
  type,
}: {
  error?: string;
  label: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  type: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-label-bold font-semibold text-on-surface">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-border-subtle bg-surface-white px-4 py-3 text-body-md outline-none transition-colors focus:border-primary-container"
        type={type}
        {...registration}
      />
      {error ? <span className="mt-1 block text-label-sm text-red-600">{error}</span> : null}
    </label>
  );
}
