"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Cart } from "@/types/api";

type CartResponse = {
  success: boolean;
  data?: Cart;
};

export function CartNavLink() {
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadCartCount() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as CartResponse;
        if (isMounted && json.success) {
          setTotalItems(json.data?.totalItems ?? 0);
        }
      } catch {
        if (isMounted) setTotalItems(0);
      }
    }

    function handleCartUpdate(event: Event) {
      const customEvent = event as CustomEvent<{ totalItems?: number }>;
      if (typeof customEvent.detail?.totalItems === "number") {
        setTotalItems(customEvent.detail.totalItems);
        return;
      }
      void loadCartCount();
    }

    void loadCartCount();
    window.addEventListener("cart:updated", handleCartUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("cart:updated", handleCartUpdate);
    };
  }, []);

  return (
    <Link
      aria-label="Gio hang"
      className="relative transition-transform hover:scale-95"
      href="/cart"
    >
      <ShoppingCart size={22} />
      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-container px-1 text-[10px] font-medium text-on-primary">
        {totalItems}
      </span>
    </Link>
  );
}
