import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/product/pagination";
import { ProductCard } from "@/components/product/product-card";
import { ProductSortSelect } from "@/components/product/product-sort-select";
import {
  getBrands,
  getCategory,
  getLayouts,
  getProducts,
  getSwitchTypes,
  slugify,
} from "@/lib/products";

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
  searchParams: Promise<{
    brandId?: string;
    keyword?: string;
    layoutId?: string;
    page?: string;
    sortBy?: string;
    switchTypeId?: string;
  }>;
}) {
  const { id } = await params;
  const {
    brandId,
    keyword,
    layoutId,
    page: pageParam,
    sortBy,
    switchTypeId,
  } = await searchParams;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  const page = Number(pageParam ?? 1);
  const selectedBrandId = toPositiveNumber(brandId);
  const selectedSwitchTypeId = toPositiveNumber(switchTypeId);
  const selectedLayoutId = toPositiveNumber(layoutId);
  const categorySlug = slugify(category.name);
  const shouldShowSwitchFilter = !categorySlug.includes("keycap");
  const shouldShowLayoutFilter = !categorySlug.includes("switch");
  const [brands, switchTypes, layouts] = await Promise.all([
    getBrands(),
    getSwitchTypes(),
    getLayouts(),
  ]);
  const products = await getProducts({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 12,
    categoryId: category.id,
    brandId: selectedBrandId,
    switchTypeId: selectedSwitchTypeId,
    layoutId: selectedLayoutId,
    keyword,
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
          {shouldShowSwitchFilter ? (
            <FilterLinkGroup
              activeId={selectedSwitchTypeId}
              basePath={`/categories/${category.id}`}
              items={switchTypes.map((item) => ({ id: item.id, label: item.name }))}
              paramName="switchTypeId"
              searchParams={{ brandId, keyword, layoutId, sortBy }}
              title="Loai Switch"
            />
          ) : null}
          {shouldShowLayoutFilter ? (
            <FilterLinkGroup
              activeId={selectedLayoutId}
              basePath={`/categories/${category.id}`}
              items={layouts.map((item) => ({ id: item.id, label: item.name }))}
              paramName="layoutId"
              searchParams={{ brandId, keyword, sortBy, switchTypeId }}
              title="Layout"
            />
          ) : null}
          <FilterLinkGroup
            activeId={selectedBrandId}
            basePath={`/categories/${category.id}`}
            items={brands.map((item) => ({ id: item.id, label: item.name }))}
            paramName="brandId"
            searchParams={{ keyword, layoutId, sortBy, switchTypeId }}
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
            basePath={`/categories/${category.id}`}
            currentPage={products.page}
            searchParams={{ brandId, keyword, layoutId, sortBy, switchTypeId }}
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
