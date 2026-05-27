import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CartManager } from "@/components/cart/cart-manager";
import { apiFetch } from "@/lib/server-api";
import type { Cart } from "@/types/api";

export const metadata: Metadata = {
  title: "Gio hang",
};

export default async function CartPage() {
  let cart: Cart;
  try {
    cart = await apiFetch<Cart>("/api/Cart", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-gutter py-12 md:py-section-padding">
      <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="hidden text-display-lg font-bold text-on-surface md:block">
            Shopping Cart
          </h1>
          <h1 className="text-display-lg-mobile font-bold text-on-surface md:hidden">
            Shopping Cart
          </h1>
          <p className="mt-2 text-body-md text-secondary">
            {cart.totalItems} san pham trong gio hang.
          </p>
        </div>
        <Link
          className="text-label-bold font-semibold text-primary-container hover:underline"
          href="/products"
        >
          Tiep tuc mua sam
        </Link>
      </div>
      <CartManager cart={cart} />
    </main>
  );
}
