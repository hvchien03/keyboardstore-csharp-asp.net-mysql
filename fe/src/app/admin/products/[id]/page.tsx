import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import {
  DeleteProductImageButton,
  ProductEditForm,
} from "@/components/admin/admin-actions";
import { AdminBackLink, AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import {
  getBrands,
  getLayouts,
  getProduct,
  getSwitchTypes,
  normalizeImageUrl,
  shouldBypassImageOptimization,
} from "@/lib/products";
import { apiFetch } from "@/lib/server-api";
import type { Brand, Category, KeyboardLayout, Product, SwitchType } from "@/types/api";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product: Product | null = null;
  let categories: Category[] = [];
  let brands: Brand[] = [];
  let switchTypes: SwitchType[] = [];
  let layouts: KeyboardLayout[] = [];

  try {
    product = await apiFetch<Product>(`/api/Product/${id}`, { auth: true });
    categories = await apiFetch<Category[]>("/api/Category", { auth: true });
    brands = await apiFetch<Brand[]>("/api/Brand", { auth: true });
    switchTypes = await apiFetch<SwitchType[]>("/api/SwitchType", { auth: true });
    layouts = await apiFetch<KeyboardLayout[]>("/api/Layout", { auth: true });
  } catch {
    product = await getProduct(id);
    if (!product) redirect("/login");
  }

  if (!product) notFound();

  return (
    <AdminShell title="Update Product">
      <AdminSectionHeader
        action={<AdminBackLink href="/admin/products" />}
        eyebrow="Catalog"
        title={product.name}
      />
      <ProductEditForm
        brands={brands.length ? brands : await getBrands()}
        categories={categories}
        layouts={layouts.length ? layouts : await getLayouts()}
        product={product}
        switchTypes={switchTypes.length ? switchTypes : await getSwitchTypes()}
      />

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-950">Product Images</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.images.map((image) => {
            const src = normalizeImageUrl(image.imageUrl);
            return (
              <div className="rounded-lg border border-slate-200 p-3" key={image.id}>
                <div className="relative h-36 rounded-lg bg-slate-50">
                  <Image
                    alt={image.alt || product.name}
                    className="object-contain p-2"
                    fill
                    src={src}
                    unoptimized={shouldBypassImageOptimization(src)}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-500">#{image.displayOrder}</span>
                  <DeleteProductImageButton image={image} productId={product.id} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
