import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { formatCurrency } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/products";
import { apiFetch } from "@/lib/server-api";
import type { Cart } from "@/types/api";

export const metadata: Metadata = {
  title: "Thanh toan",
};

export default async function CheckoutPage() {
  let cart: Cart;
  try {
    cart = await apiFetch<Cart>("/api/Cart", { auth: true });
  } catch {
    redirect("/login");
  }

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 py-10 md:px-8 md:py-16">
      <h1 className="mb-10 text-display-lg-mobile font-bold md:text-display-lg">
        Thanh toan
      </h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-8 lg:col-span-7">
          <h2 className="mb-6 text-headline-md font-semibold">
            Thong tin giao hang
          </h2>
          <CheckoutForm cart={cart} />
        </section>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] md:p-8">
            <h2 className="mb-6 border-b border-border-subtle pb-4 text-headline-md font-semibold">
              Tom tat don hang
            </h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div className="flex gap-4" key={item.id}>
                  <div className="relative h-20 w-20 overflow-hidden rounded border border-border-subtle bg-surface-container-low">
                    <Image
                      alt={item.productName}
                      className="object-contain p-2"
                      fill
                      src={normalizeImageUrl(item.imageUrl)}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-body-md font-medium text-on-surface">
                      {item.productName}
                    </h3>
                    <p className="text-label-sm text-secondary">x{item.quantity}</p>
                  </div>
                  <span className="text-body-md font-semibold">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="my-6 border-t border-border-subtle" />
            <div className="flex justify-between text-headline-md font-semibold text-on-surface">
              <span>Tong cong</span>
              <span>{formatCurrency(cart.totalAmount)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
