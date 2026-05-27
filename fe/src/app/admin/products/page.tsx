import Image from "next/image";
import { redirect } from "next/navigation";
import { DeleteProductButton, ProductAdminForm } from "@/components/admin/admin-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { formatCurrency } from "@/lib/format";
import { getProducts, normalizeImageUrl } from "@/lib/products";
import { apiFetch } from "@/lib/server-api";
import type { Category } from "@/types/api";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? 1);
  const products = await getProducts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
  });
  let categories: Category[] = [];

  try {
    categories = await apiFetch<Category[]>("/api/Category", { auth: true });
  } catch {
    redirect("/login");
  }

  return (
    <AdminShell title="Products">
      <ProductAdminForm categories={categories} />
      <div className="mt-gutter text-body-md text-secondary">
        Hien thi {products.data.length} trong {products.totalCount} san pham
      </div>
      <div className="mt-gutter overflow-hidden rounded-lg border border-border-subtle bg-surface-white">
        {products.data.map((product) => (
          <div className="grid grid-cols-1 gap-4 border-b border-border-subtle p-4 md:grid-cols-[72px_1fr_140px_90px_80px] md:items-center" key={product.id}>
            <div className="relative h-16 w-16 rounded bg-surface-container-low">
              <Image alt={product.name} className="object-contain p-1" fill src={normalizeImageUrl(product.imageUrl)} />
            </div>
            <div>
              <h2 className="font-semibold text-on-surface">{product.name}</h2>
              <p className="line-clamp-1 text-body-md text-secondary">{product.description}</p>
            </div>
            <span>{formatCurrency(product.price)}</span>
            <span>Stock {product.stock}</span>
            <DeleteProductButton product={product} />
          </div>
        ))}
      </div>
      <Pagination
        basePath="/admin/products"
        currentPage={products.page}
        totalPages={products.totalPages}
      />
    </AdminShell>
  );
}
