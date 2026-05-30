import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { ProductSortSelect } from "@/components/product/product-sort-select";
import {
  getBrands,
  getLayouts,
  getProducts,
  getSwitchTypes,
  resolveCategory,
  slugify,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Ban phim co custom",
  description: "Danh muc san pham keyboard, switch, keycap va phu kien.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    brandId?: string;
    category?: string;
    layoutId?: string;
    page?: string;
    keyword?: string;
    sortBy?: string;
    switchTypeId?: string;
  }>;
}) {
  const {
    brandId,
    category,
    layoutId,
    keyword,
    page: pageParam,
    sortBy,
    switchTypeId,
  } = await searchParams;
  const currentCategory = await resolveCategory(category);
  const page = Number(pageParam ?? 1);
  const selectedBrandId = toPositiveNumber(brandId);
  const selectedSwitchTypeId = toPositiveNumber(switchTypeId);
  const selectedLayoutId = toPositiveNumber(layoutId);
  const [brands, switchTypes, layouts] = await Promise.all([
    getBrands(),
    getSwitchTypes(),
    getLayouts(),
  ]);
  const products = await getProducts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    categoryId: currentCategory?.id,
    brandId: selectedBrandId,
    switchTypeId: selectedSwitchTypeId,
    layoutId: selectedLayoutId,
    keyword,
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
          <FilterLinkGroup
            activeId={selectedSwitchTypeId}
            basePath="/products"
            items={switchTypes.map((item) => ({ id: item.id, label: item.name }))}
            paramName="switchTypeId"
            searchParams={{ brandId, category, keyword, layoutId, sortBy }}
            title="Loai Switch"
          />
          <FilterLinkGroup
            activeId={selectedLayoutId}
            basePath="/products"
            items={layouts.map((item) => ({ id: item.id, label: item.name }))}
            paramName="layoutId"
            searchParams={{ brandId, category, keyword, sortBy, switchTypeId }}
            title="Layout"
          />
          <FilterLinkGroup
            activeId={selectedBrandId}
            basePath="/products"
            items={brands.map((item) => ({ id: item.id, label: item.name }))}
            paramName="brandId"
            searchParams={{ category, keyword, layoutId, sortBy, switchTypeId }}
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
              <ProductSortSelect value={sortBy} />
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
              brandId,
              category: currentCategory ? slugify(currentCategory.name) : undefined,
              keyword,
              layoutId,
              sortBy,
              switchTypeId,
            }}
            totalPages={products.totalPages}
          />
        </section>
      </div>
    </main>
  );
}

function FilterLinkGroup({
  activeId,
  basePath,
  items,
  paramName,
  searchParams,
  title,
}: {
  activeId?: number;
  basePath: string;
  items: Array<{ id: number; label: string }>;
  paramName: string;
  searchParams: Record<string, string | undefined>;
  title: string;
}) {
  return (
    <div className="border-t border-border-subtle pt-6 first:border-t-0 first:pt-0">
      <h3 className="mb-4 text-label-bold font-semibold uppercase tracking-wider text-on-surface">
        {title}
      </h3>
      <div className="space-y-2">
        {activeId ? (
          <Link
            className="block rounded px-3 py-2 text-body-md text-primary-container hover:bg-surface-container-low"
            href={buildFilterHref(basePath, searchParams)}
          >
            Tat ca
          </Link>
        ) : null}
        {items.map((item) => (
          <Link
            className={`block rounded px-3 py-2 text-body-md transition-colors ${
              activeId === item.id
                ? "bg-surface-container-low text-primary-container"
                : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
            }`}
            href={buildFilterHref(basePath, {
              ...searchParams,
              [paramName]: String(item.id),
            })}
            key={item.id}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function buildFilterHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.size ? `${basePath}?${params.toString()}` : basePath;
}

function toPositiveNumber(value?: string) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
}
