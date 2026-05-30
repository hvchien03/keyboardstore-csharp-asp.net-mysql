import { ArrowDownRight, ArrowUpRight, Building2 } from "lucide-react";
import { redirect } from "next/navigation";
import {
  BrandAdminForm,
  BrandEditDialogButton,
  DeleteBrandButton,
} from "@/components/admin/admin-actions";
import {
  AdminListCount,
  AdminSearchForm,
  AdminSectionHeader,
  AdminShell,
} from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { getSearchValue, paginateAdminList } from "@/lib/admin-list";
import { apiFetch } from "@/lib/server-api";
import type { Brand, Product } from "@/types/api";

export default async function AdminBrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  let brands: Brand[] = [];
  let products: Product[] = [];
  try {
    brands = await apiFetch<Brand[]>("/api/Brand", { auth: true });
    products = await apiFetch<Product[]>("/api/Product", { auth: true });
  } catch {
    redirect("/login");
  }

  const keyword = getSearchValue(q);
  const filtered = keyword
    ? brands.filter((brand) =>
        `${brand.name} ${brand.description}`.toLowerCase().includes(keyword),
      )
    : brands;
  const paged = paginateAdminList(filtered, page, 6);

  const productCountByBrand = new Map<number, number>();
  products.forEach((product) => {
    productCountByBrand.set(
      product.brandId,
      (productCountByBrand.get(product.brandId) ?? 0) + 1,
    );
  });

  return (
    <AdminShell title="Brand Management">
      <AdminSectionHeader eyebrow="Portfolio" title="Partner Brands" />
      <BrandAdminForm />
      <AdminSearchForm action="/admin/brands" placeholder="Tim brand..." q={q} />
      <AdminListCount count={paged.data.length} total={paged.totalCount} />

      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {paged.data.map((brand, index) => {
          const productCount = productCountByBrand.get(brand.id) ?? 0;
          const isGrowth = index % 3 !== 1;
          return (
            <article
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              key={brand.id}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-950">{brand.name}</h2>
                    <p className="text-sm text-slate-500">Keyboard portfolio</p>
                  </div>
                </div>
                <Building2 className="text-emerald-600" size={20} />
              </div>

              <p className="min-h-12 text-sm text-slate-600">
                {brand.description || "No description available."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Products
                  </p>
                  <p className="mt-1 text-xl font-bold">{productCount}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Performance
                  </p>
                  <p
                    className={`mt-1 flex items-center gap-1 text-xl font-bold ${
                      isGrowth ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isGrowth ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    {isGrowth ? "8%" : "3%"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <BrandEditDialogButton brand={brand} />
                <DeleteBrandButton id={brand.id} />
              </div>
            </article>
          );
        })}
      </div>
      <Pagination basePath="/admin/brands" currentPage={paged.page} searchParams={{ q }} totalPages={paged.totalPages} />
    </AdminShell>
  );
}
