import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { formatCurrency } from "@/lib/format";
import {
  getProductImageUrl,
  shouldBypassImageOptimization,
} from "@/lib/products";
import type { Product } from "@/types/api";

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border-subtle bg-surface-white transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]">
      <Link
        className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface-container-lowest p-6"
        href={`/products/${product.id}`}
      >
        <Image
          alt={product.name}
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          src={imageUrl}
          unoptimized={shouldBypassImageOptimization(imageUrl)}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          <span className="rounded bg-surface-container-low px-2 py-1 text-label-sm font-medium text-on-surface">
            {product.stock > 0 ? "Con hang" : "Het hang"}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1 text-label-sm text-primary-container">
          {[0, 1, 2, 3, 4].map((item) => (
            <Star fill="currentColor" key={item} size={16} strokeWidth={1.5} />
          ))}
          <span className="ml-1 text-secondary">({product.stock})</span>
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="mb-1 text-body-lg font-semibold text-on-surface transition-colors group-hover:text-primary-container">
            {product.name}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 flex-1 text-body-md text-secondary">
          {product.description || `${product.brandName} · ${product.categoryName}`}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-headline-md font-semibold text-on-surface">
            {formatCurrency(product.price)}
          </span>
          <AddToCartButton productId={product.id} productName={product.name} />
        </div>
      </div>
    </article>
  );
}
