import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { getCategory, getProducts } from "@/lib/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategory(id);

  return {
    title: category?.name ?? "Danh muc san pham",
    description: category?.description,
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam, sortBy } = await searchParams;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  const page = Number(pageParam ?? 1);
  const products = await getProducts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    categoryId: category.id,
    sortBy,
  });

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-section-padding md:px-8">
      <div className="mb-12">
        <p className="mb-3 text-label-bold font-semibold uppercase tracking-wide text-primary-container">
          Danh muc
        </p>
        <h1 className="mb-4 text-display-lg-mobile font-bold text-on-surface md:text-display-lg">
          {category.name}
        </h1>
        <p className="max-w-2xl text-body-lg text-text-muted">
          {category.description || "Cac san pham duoc chon loc trong danh muc nay."}
        </p>
      </div>

      <div className="flex flex-col gap-gutter md:flex-row">
        <aside className="w-full shrink-0 space-y-8 md:w-64">
          <FilterGroup
            options={["Linear", "Tactile", "Clicky", "Silent"]}
            title="Loai Switch"
          />
          <FilterGroup
            options={["60%", "65%", "75%", "TKL (80%)", "Full Size (100%)"]}
            title="Layout"
          />
          <FilterGroup
            options={["Keychron", "Akko", "Epomaker", "Varmilo"]}
            title="Thuong Hieu"
          />
        </aside>

        <section className="flex-1">
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
            <span className="text-body-md text-secondary">
              Hien thi {products.data.length} trong {products.totalCount} san pham
            </span>
            <Link
              className="text-label-bold font-semibold text-primary-container hover:underline"
              href="/products"
            >
              Xem tat ca
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {products.data.length > 0 ? (
              products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="rounded-lg border border-border-subtle bg-surface-white p-8 text-center text-secondary sm:col-span-2 lg:col-span-3">
                Chua co san pham trong danh muc nay.
              </div>
            )}
          </div>

          <Pagination
            basePath={`/categories/${category.id}`}
            currentPage={products.page}
            searchParams={{ sortBy }}
            totalPages={products.totalPages}
          />
        </section>
      </div>
    </main>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="border-t border-border-subtle pt-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-label-bold font-semibold uppercase tracking-wider text-on-surface">
        {title}
      </h3>
      <div className="space-y-3">
        {options.map((option) => (
          <label className="group flex cursor-pointer items-center gap-3" key={option}>
            <input
              className="h-5 w-5 rounded border-border-subtle text-primary-container accent-primary-container"
              type="checkbox"
            />
            <span className="text-body-md text-secondary transition-colors group-hover:text-on-surface">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
