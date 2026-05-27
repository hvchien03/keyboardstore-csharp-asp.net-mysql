import type { Metadata } from "next";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { getProducts, resolveCategory, slugify } from "@/lib/products";

export const metadata: Metadata = {
  title: "Ban phim co custom",
  description: "Danh muc san pham keyboard, switch, keycap va phu kien.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; sortBy?: string }>;
}) {
  const { category, page: pageParam, sortBy } = await searchParams;
  const currentCategory = await resolveCategory(category);
  const page = Number(pageParam ?? 1);
  const products = await getProducts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    categoryId: currentCategory?.id,
    sortBy,
  });

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-section-padding md:px-8">
      <div className="mb-12">
        <h1 className="mb-4 text-display-lg-mobile font-bold text-on-surface md:text-display-lg">
          {currentCategory?.name ?? "Ban Phim Co Custom"}
        </h1>
        <p className="max-w-2xl text-body-lg text-text-muted">
          {currentCategory?.description ??
            "Kham pha bo suu tap ban phim co cao cap duoc thiet ke tinh xao, mang lai trai nghiem go phim hoan hao va am thanh doc dao."}
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
          <div className="border-t border-border-subtle pt-6">
            <h3 className="mb-4 text-label-bold font-semibold uppercase tracking-wider text-on-surface">
              Khoang Gia
            </h3>
            <div className="space-y-4">
              <input
                className="w-full accent-primary-container"
                max="10000000"
                min="0"
                type="range"
              />
              <div className="flex justify-between text-label-sm font-medium text-secondary">
                <span>0d</span>
                <span>10.000.000d+</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1">
          <div className="mb-6 flex flex-col justify-between gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-center">
            <span className="text-body-md text-secondary">
              Hien thi {products.data.length} trong {products.totalCount} san
              pham
            </span>
            <label className="flex items-center gap-2 text-body-md text-secondary">
              Sap xep theo:
              <select className="rounded border border-border-subtle bg-surface-white px-2 py-1 text-body-md text-on-surface focus:border-primary-container">
                <option>Moi nhat</option>
                <option>Gia tang dan</option>
                <option>Gia giam dan</option>
                <option>Ban chay</option>
              </select>
            </label>
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
            basePath="/products"
            currentPage={products.page}
            searchParams={{
              category: currentCategory ? slugify(currentCategory.name) : undefined,
              sortBy,
            }}
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
