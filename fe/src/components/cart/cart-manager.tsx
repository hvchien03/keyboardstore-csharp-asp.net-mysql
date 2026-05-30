"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/lib/format";
import {
  normalizeImageUrl,
  shouldBypassImageOptimization,
} from "@/lib/products";
import type { Cart, CartItem } from "@/types/api";

type CartResponse = {
  success: boolean;
  data?: Cart;
  message?: string;
};

export function CartManager({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [deleteItem, setDeleteItem] = useState<CartItem | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function updateItem(item: CartItem, quantity: number) {
    if (quantity < 1 || quantity > item.stock) return;
    setPendingId(item.productId);
    try {
      const res = await fetch(`/api/cart/items/${item.productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const json = (await res.json()) as CartResponse;
      if (!res.ok || !json.success) throw new Error(json.message);
      window.dispatchEvent(
        new CustomEvent("cart:updated", {
          detail: { totalItems: json.data?.totalItems },
        }),
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the cap nhat");
    } finally {
      setPendingId(null);
    }
  }

  async function removeItem(productId: number) {
    setPendingId(productId);
    try {
      const res = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as CartResponse;
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success("Da xoa san pham khoi gio hang");
      window.dispatchEvent(new CustomEvent("cart:updated"));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the xoa");
    } finally {
      setPendingId(null);
      setDeleteItem(null);
    }
  }

  if (cart.items.length === 0) {
    return (
      <section className="rounded-lg border border-border-subtle bg-surface-white p-10 text-center">
        <h1 className="mb-3 text-headline-md font-semibold text-on-surface">
          Gio hang dang trong
        </h1>
        <p className="mb-6 text-body-md text-secondary">
          Chon mot ban phim, switch hoac keycap yeu thich de bat dau.
        </p>
        <Link
          className="inline-flex rounded bg-primary-container px-6 py-3 text-label-bold font-semibold text-on-primary"
          href="/products"
        >
          Xem san pham
        </Link>
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <section className="lg:col-span-8">
        {cart.items.map((item) => (
          (() => {
            const imageUrl = normalizeImageUrl(item.imageUrl);

            return (
          <div
            className="group flex flex-col items-start border-b border-border-subtle py-6 sm:flex-row sm:items-center"
            key={item.id}
          >
            <div className="relative mb-4 h-32 w-full shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-surface-container-low sm:mb-0 sm:w-32">
              <Image
                alt={item.productName}
                className="object-contain p-3"
                fill
                src={imageUrl}
                unoptimized={shouldBypassImageOptimization(imageUrl)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-4 sm:ml-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[20px] font-semibold leading-tight text-on-surface">
                  {item.productName}
                </h3>
                <p className="mt-1 text-body-md text-secondary">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-md border border-border-subtle bg-surface-white">
                  <button
                    className="px-3 py-2 text-secondary disabled:opacity-50"
                    disabled={pendingId === item.productId}
                    onClick={() => updateItem(item, item.quantity - 1)}
                    type="button"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-[44px] border-x border-border-subtle px-3 py-2 text-center text-body-md">
                    {item.quantity}
                  </span>
                  <button
                    className="px-3 py-2 text-secondary disabled:opacity-50"
                    disabled={pendingId === item.productId}
                    onClick={() => updateItem(item, item.quantity + 1)}
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="text-secondary transition-colors hover:text-red-600"
                  disabled={pendingId === item.productId}
                  onClick={() => setDeleteItem(item)}
                  type="button"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="min-w-[120px] text-right text-body-lg font-semibold text-on-surface">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          </div>
            );
          })()
        ))}
      </section>

      <aside className="lg:col-span-4">
        <div className="sticky top-28 rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] lg:p-8">
          <h2 className="mb-6 text-headline-md font-bold text-on-surface">
            Tom tat don hang
          </h2>
          <div className="space-y-3 text-body-md text-secondary">
            <div className="flex justify-between">
              <span>Tam tinh</span>
              <span>{formatCurrency(cart.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Van chuyen</span>
              <span>Tinh khi thanh toan</span>
            </div>
          </div>
          <div className="my-6 border-t border-border-subtle" />
          <div className="mb-6 flex justify-between text-headline-md font-semibold text-on-surface">
            <span>Tong cong</span>
            <span>{formatCurrency(cart.totalAmount)}</span>
          </div>
          <Link
            className="block w-full rounded-lg bg-primary-container px-6 py-3 text-center text-label-bold font-semibold text-on-primary"
            href="/checkout"
          >
            Thanh toan
          </Link>
        </div>
      </aside>
      <ConfirmDialog
        description={
          deleteItem
            ? `Ban co chac muon xoa "${deleteItem.productName}" khoi gio hang khong?`
            : ""
        }
        isPending={deleteItem ? pendingId === deleteItem.productId : false}
        onCancel={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) void removeItem(deleteItem.productId);
        }}
        open={Boolean(deleteItem)}
      />
    </div>
  );
}
