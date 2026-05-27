import type { Category, PagedResult, Product } from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5143";
const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_API_ASSET_URL ?? "http://localhost:5143";

const legacyProductImages: Record<string, string> = {
  "ducky.jpg": "/images/products/keyboard-base.jpg",
  "keychron-k2.jpg": "/images/products/keyboard-base.jpg",
  "rk61.jpg": "/images/products/hero-keyboard.jpg",
  "gmk-olivia.jpg": "/images/products/bow-keycaps.jpg",
};

export function normalizeImageUrl(path?: string | null): string {
  if (!path) return "/placeholder-product.svg";
  if (path.startsWith("/images/") || path.startsWith("/placeholder-")) {
    return path;
  }
  if (path.startsWith("http")) {
    const url = new URL(path);

    if (url.hostname === "example.com") {
      return (
        legacyProductImages[url.pathname.split("/").pop() ?? ""] ??
        "/images/products/keyboard-base.jpg"
      );
    }

    return path;
  }
  return `${ASSET_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function publicFetch<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

type ProductQuery = {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  keyword?: string;
  sortBy?: string;
};

function toPagedResult(
  data: Product[],
  page: number,
  pageSize: number,
): PagedResult<Product> {
  const normalizedPage = Math.max(1, page);
  const normalizedPageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(data.length / normalizedPageSize));
  const start = (normalizedPage - 1) * normalizedPageSize;
  const pagedData = data.slice(start, start + normalizedPageSize);

  return {
    data: pagedData,
    page: normalizedPage,
    pageSize: normalizedPageSize,
    totalCount: data.length,
    totalPages,
    hasPrevious: normalizedPage > 1,
    hasNext: normalizedPage < totalPages,
  };
}

export async function getProducts(
  pageOrQuery: number | ProductQuery = 1,
  pageSizeArg = 12,
) {
  const query =
    typeof pageOrQuery === "number"
      ? { page: pageOrQuery, pageSize: pageSizeArg }
      : pageOrQuery;
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.sortBy) params.set("sortBy", query.sortBy);

  try {
    return await publicFetch<PagedResult<Product>>(
      `/api/Product/search?${params.toString()}`,
      60,
    );
  } catch {
    const filtered = query.categoryId
      ? sampleProducts.filter((product) => product.categoryId === query.categoryId)
      : sampleProducts;

    return toPagedResult(filtered, page, pageSize);
  }
}

export async function getLatestProducts(limit = 4) {
  const result = await getProducts(1, limit);
  return result.data.slice(0, limit);
}

export async function getProduct(id: string | number) {
  try {
    return await publicFetch<Product>(`/api/Product/${id}`, 60);
  } catch {
    return sampleProducts.find((product) => product.id === Number(id)) ?? null;
  }
}

export async function getCategories() {
  try {
    return await publicFetch<Category[]>("/api/Category", 300);
  } catch {
    return sampleCategories;
  }
}

export async function getCategory(id: string | number) {
  try {
    return await publicFetch<Category>(`/api/Category/${id}`, 300);
  } catch {
    return sampleCategories.find((category) => category.id === Number(id)) ?? null;
  }
}

export async function resolveCategory(category?: string) {
  if (!category) return null;
  const categories = await getCategories();
  const normalized = category.toLowerCase().trim();

  return (
    categories.find((item) => String(item.id) === normalized) ??
    categories.find((item) => slugify(item.name) === normalized) ??
    null
  );
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const sampleCategories: Category[] = [
  {
    id: 1,
    name: "Custom Keyboards",
    description: "Ban phim co custom va kit lap rap cao cap.",
  },
  {
    id: 2,
    name: "Switches",
    description: "Linear, tactile, clicky va silent switch.",
  },
  {
    id: 3,
    name: "Keycaps",
    description: "Keycap PBT, double-shot va profile pho bien.",
  },
  {
    id: 4,
    name: "Accessories",
    description: "Cable, stabilizer va phu kien ban phim.",
  },
];

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "KFE-V1 Aluminum Base",
    description: "Case nhom nguyen khoi, gasket mount, hot-swap.",
    price: 3490000,
    stock: 18,
    imageUrl: "/images/products/keyboard-base.jpg",
    categoryId: 1,
    categoryName: "Custom Keyboards",
  },
  {
    id: 2,
    name: "KFE Silent Linear Switch",
    description: "Luc nhan 45g, hanh trinh 3.8mm, pack 35 switch.",
    price: 450000,
    stock: 64,
    imageUrl: "/images/products/silent-linear-switch.jpg",
    categoryId: 2,
    categoryName: "Switches",
  },
  {
    id: 3,
    name: "BoW Minimalist Keycaps",
    description: "PBT double-shot, Cherry profile, day du layout pho bien.",
    price: 990000,
    stock: 24,
    imageUrl: "/images/products/bow-keycaps.jpg",
    categoryId: 3,
    categoryName: "Keycaps",
  },
  {
    id: 4,
    name: "Premium Aviator Cable",
    description: "USB-C to USB-A, boc du ben, dau aviator kim loai.",
    price: 550000,
    stock: 39,
    imageUrl: "/images/products/aviator-cable.jpg",
    categoryId: 4,
    categoryName: "Accessories",
  },
];
