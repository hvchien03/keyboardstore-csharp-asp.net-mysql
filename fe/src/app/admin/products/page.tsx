import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteProductButton, ProductAdminForm } from "@/components/admin/admin-actions";
import { AdminSectionHeader, AdminShell } from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { formatCurrency } from "@/lib/format";
import {
  getBrands,
  getLayouts,
  getProductImageUrl,
  getSwitchTypes,
  shouldBypassImageOptimization,
} from "@/lib/products";
import { apiFetch } from "@/lib/server-api";
import type {
  Brand,
  Category,
  KeyboardLayout,
  PagedResult,
  Product,
  SwitchType,
} from "@/types/api";

type AdminProductSearchParams = {
  keyword?: string;
  maxPrice?: string;
  minPrice?: string;
  missingImages?: string;
  page?: string;
  sortBy?: string;
};

const PAGE_SIZE = 10;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<AdminProductSearchParams>;
}) {
  const filters = await searchParams;
  const page = toPositiveInt(filters.page, 1);
  const query = buildProductQuery(filters, page);
  let products: PagedResult<Product>;
  let categories: Category[] = [];
  let brands: Brand[] = [];
  let switchTypes: SwitchType[] = [];
  let layouts: KeyboardLayout[] = [];

  try {
    const endpoint =
      filters.missingImages === "true"
        ? `/api/Product/without-images?${query}`
        : `/api/Product/search?${query}`;

    products = await apiFetch<PagedResult<Product>>(endpoint, { auth: true });
    categories = await apiFetch<Category[]>("/api/Category", { auth: true });
    brands = await apiFetch<Brand[]>("/api/Brand", { auth: true });
    switchTypes = await apiFetch<SwitchType[]>("/api/SwitchType", { auth: true });
    layouts = await apiFetch<KeyboardLayout[]>("/api/Layout", { auth: true });
  } catch {
    redirect("/login");
  }

  const paginationFilters = {
    keyword: filters.keyword,
    maxPrice: filters.maxPrice,
    minPrice: filters.minPrice,
    missingImages: filters.missingImages,
    sortBy: filters.sortBy,
  };

  return (
    <AdminShell title="Products">
      <AdminSectionHeader eyebrow="Catalog" title="Create Product" />
      <ProductAdminForm
        brands={brands.length ? brands : await getBrands()}
        categories={categories}
        layouts={layouts.length ? layouts : await getLayouts()}
        switchTypes={switchTypes.length ? switchTypes : await getSwitchTypes()}
      />

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
            Filters
          </p>
          <h2 className="text-lg font-bold text-slate-950">Tim va loc san pham</h2>
        </div>
        <form className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto]" method="get">
          <input
            className="admin-input"
            defaultValue={filters.keyword}
            name="keyword"
            placeholder="Loc theo ten san pham"
          />
          <input
            className="admin-input"
            defaultValue={filters.minPrice}
            min={0}
            name="minPrice"
            placeholder="Gia tu"
            type="number"
          />
          <input
            className="admin-input"
            defaultValue={filters.maxPrice}
            min={0}
            name="maxPrice"
            placeholder="Gia den"
            type="number"
          />
          <select className="admin-input" defaultValue={filters.sortBy ?? ""} name="sortBy">
            <option value="">Moi nhat</option>
            <option value="name">Ten A-Z</option>
            <option value="price_asc">Gia tang dan</option>
            <option value="price_desc">Gia giam dan</option>
            <option value="oldest">Cu nhat</option>
          </select>
          <label className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700">
            <input
              defaultChecked={filters.missingImages === "true"}
              name="missingImages"
              type="checkbox"
              value="true"
            />
            Chua co anh
          </label>
          <button className="h-11 rounded-lg bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
            Loc
          </button>
        </form>
        <div className="mt-3">
          <Link className="text-sm font-semibold text-slate-500 hover:text-slate-950" href="/admin/products">
            Xoa bo loc
          </Link>
        </div>
      </section>

      <div className="mt-6 text-sm font-medium text-slate-600">
        Hien thi {products.data.length} trong {products.totalCount} san pham
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {products.data.map((product) => (
          <div className="grid grid-cols-1 gap-4 border-b border-slate-100 p-4 md:grid-cols-[72px_1fr_140px_90px_132px] md:items-center" key={product.id}>
            <div className="relative h-16 w-16 rounded-lg bg-slate-50">
              {(() => {
                const imageUrl = getProductImageUrl(product);
                return (
                  <Image
                    alt={product.name}
                    className="object-contain p-1"
                    fill
                    src={imageUrl}
                    unoptimized={shouldBypassImageOptimization(imageUrl)}
                  />
                );
              })()}
            </div>
            <div>
              <h2 className="font-bold text-slate-950">{product.name}</h2>
              <p className="line-clamp-1 text-sm text-slate-500">
                {product.brandName} - {product.categoryName}
              </p>
              {!product.images.length ? (
                <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                  Chua co anh
                </span>
              ) : null}
            </div>
            <span className="font-semibold">{formatCurrency(product.price)}</span>
            <span className="text-sm text-slate-600">Stock {product.stock}</span>
            <div className="flex gap-2">
              <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/products/${product.id}`}>
                Sua
              </Link>
              <DeleteProductButton product={product} />
            </div>
          </div>
        ))}
      </div>
      <Pagination
        basePath="/admin/products"
        currentPage={products.page}
        searchParams={paginationFilters}
        totalPages={products.totalPages}
      />
    </AdminShell>
  );
}

function buildProductQuery(filters: AdminProductSearchParams, page: number) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });

  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);

  return params.toString();
}

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
