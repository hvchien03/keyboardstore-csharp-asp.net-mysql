"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddToCartButton({
  productId,
  productName,
  quantity = 1,
  className = "flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface transition-colors hover:bg-primary-container hover:text-white",
}: {
  productId: number;
  productName: string;
  quantity?: number;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function addToCart() {
    setIsPending(true);
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error(json.message ?? "Khong the them vao gio hang");
      }

      toast.success(`Da them ${productName} vao gio hang`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Co loi xay ra");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      aria-label={`Them ${productName} vao gio hang`}
      className={className}
      disabled={isPending}
      onClick={addToCart}
      type="button"
    >
      <ShoppingCart size={20} />
    </button>
  );
}
