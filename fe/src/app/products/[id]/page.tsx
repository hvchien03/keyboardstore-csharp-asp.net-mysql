import { Check, Heart, Truck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product/product-card";
import { formatCurrency } from "@/lib/format";
import {
  getLatestProducts,
  getProduct,
} from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product?.name ?? "San pham",
    description: product?.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const related = await getLatestProducts(4);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 py-10 md:px-8 md:py-16">
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col">
          <span className="mb-3 text-label-bold font-semibold uppercase tracking-wide text-primary-container">
            {product.categoryName}
          </span>
          <h1 className="mb-4 text-display-lg-mobile font-bold text-on-surface md:text-display-lg">
            {product.name}
          </h1>
          <p className="mb-6 text-body-lg text-secondary">{product.description}</p>
          <p className="mb-8 text-display-lg-mobile font-bold text-primary-container">
            {formatCurrency(product.price)}
          </p>
          <div className="mb-8 h-px w-full bg-border-subtle" />

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              product.brandName,
              product.switchTypeName ?? "Hot-swap",
              product.layoutName ?? "Keyboard kit",
            ].map((option) => (
              <div
                className="rounded-lg border border-border-subtle bg-surface-white p-4 transition-colors hover:bg-surface-container-low"
                key={option}
              >
                <span className="text-label-bold font-semibold text-on-surface">
                  {option}
                </span>
              </div>
            ))}
          </div>

          <div className="mb-8 grid gap-3 text-body-md text-secondary">
            <p className="flex items-center gap-2">
              <Check className="text-success-green" size={18} /> Ton kho:{" "}
              {product.stock}
            </p>
            <p className="flex items-center gap-2">
              <Truck className="text-primary-container" size={18} /> Giao hang
              nhanh trong 2-4 ngay
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-6 py-4 text-label-bold font-semibold text-on-primary transition-opacity hover:opacity-90"
              productId={product.id}
              productName={product.name}
            />
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-on-background px-6 py-4 text-label-bold font-semibold text-on-background transition-colors hover:bg-surface-container-low">
              <Heart size={18} /> Yeu thich
            </button>
          </div>
        </div>
      </section>

      <section className="mt-section-padding">
        <h2 className="mb-10 text-center text-headline-md font-semibold text-on-surface">
          Dinh cao thiet ke ky thuat
        </h2>
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          <InfoCard title="Gasket Mount Design" />
          <InfoCard title="South-facing RGB" />
          <InfoCard title="Ket noi da phuong thuc" />
          <InfoCard title="Tuy bien QMK/VIA" />
        </div>
      </section>

      <section className="mt-section-padding">
        <h2 className="mb-8 text-headline-md font-semibold text-on-surface">
          San pham lien quan
        </h2>
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function InfoCard({ title }: { title: string }) {
  return (
    <article className="rounded-xl border border-border-subtle bg-surface-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <h3 className="mb-3 text-headline-md font-semibold text-on-surface">
        {title}
      </h3>
      <p className="text-body-md text-secondary">
        Cau truc duoc tinh chinh de mang lai cam giac go chac, am thanh gon va
        do ben dung chat ban phim co cao cap.
      </p>
    </article>
  );
}
