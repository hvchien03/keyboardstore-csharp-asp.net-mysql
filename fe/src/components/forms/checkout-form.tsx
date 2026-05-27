"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Loader2, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { checkoutSchema } from "@/lib/validators";
import type { Cart } from "@/types/api";

type CheckoutValues = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: "",
      shippingPhone: "",
      shippingAddress: "",
      note: "",
      paymentMethod: "COD",
    },
  });
  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  });

  async function onSubmit(values: CheckoutValues) {
    setIsPending(true);
    const orderPayload = {
      shippingName: values.shippingName,
      shippingPhone: values.shippingPhone,
      shippingAddress: values.shippingAddress,
      note: values.note,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      if (values.paymentMethod === "COD") {
        const res = await fetch("/api/checkout/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        router.push(`/account/orders/${json.data.id}?status=confirmed`);
        return;
      }

      const res = await fetch("/api/payment/create-vnpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.data?.paymentUrl) {
        throw new Error(json.message ?? "Khong the tao lien ket thanh toan");
      }
      window.location.assign(json.data.paymentUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Co loi xay ra");
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <Input label="Ho ten nguoi nhan" name="shippingName" form={form} />
      <Input label="So dien thoai" name="shippingPhone" form={form} />
      <label className="block">
        <span className="mb-2 block text-label-bold font-semibold text-on-surface">
          Dia chi giao hang
        </span>
        <textarea
          className="min-h-28 w-full rounded-lg border border-border-subtle bg-surface-white px-4 py-3 outline-none focus:border-primary-container"
          {...form.register("shippingAddress")}
        />
        {form.formState.errors.shippingAddress?.message ? (
          <span className="text-label-sm text-red-600">
            {form.formState.errors.shippingAddress.message}
          </span>
        ) : null}
      </label>
      <Input label="Ghi chu" name="note" form={form} required={false} />

      <div>
        <h3 className="mb-3 text-label-bold font-semibold uppercase tracking-wide text-on-surface">
          Phuong thuc thanh toan
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <PaymentOption
            checked={paymentMethod === "COD"}
            icon={<Wallet size={22} />}
            label="COD"
            onChange={() => form.setValue("paymentMethod", "COD")}
            value="Thanh toan khi nhan hang"
          />
          <PaymentOption
            checked={paymentMethod === "VNPay"}
            icon={<CreditCard size={22} />}
            label="VNPay"
            onChange={() => form.setValue("paymentMethod", "VNPay")}
            value="Cong thanh toan VNPay"
          />
        </div>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-4 text-label-bold font-semibold text-on-primary disabled:opacity-60"
        disabled={isPending || cart.items.length === 0}
        type="submit"
      >
        {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
        Dat hang
      </button>
    </form>
  );
}

function Input({
  form,
  label,
  name,
}: {
  form: ReturnType<typeof useForm<CheckoutValues>>;
  label: string;
  name: keyof CheckoutValues;
  required?: boolean;
}) {
  const error = form.formState.errors[name]?.message;
  return (
    <label className="block">
      <span className="mb-2 block text-label-bold font-semibold text-on-surface">
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-border-subtle bg-surface-white px-4 py-3 outline-none focus:border-primary-container"
        {...form.register(name)}
      />
      {error ? <span className="text-label-sm text-red-600">{error}</span> : null}
    </label>
  );
}

function PaymentOption({
  checked,
  icon,
  label,
  onChange,
  value,
}: {
  checked: boolean;
  icon: React.ReactNode;
  label: string;
  onChange: () => void;
  value: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-subtle p-4 transition-colors hover:bg-surface-container-low">
      <input checked={checked} onChange={onChange} type="radio" />
      <span className="text-primary-container">{icon}</span>
      <span>
        <span className="block text-label-bold font-semibold text-on-surface">
          {label}
        </span>
        <span className="text-label-sm text-secondary">{value}</span>
      </span>
    </label>
  );
}
