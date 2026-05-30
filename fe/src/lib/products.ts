import type {
  Brand,
  Category,
  KeyboardLayout,
  PagedResult,
  Product,
  SwitchType,
} from "@/types/api";

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

export function getProductImageUrl(product: Product) {
  return normalizeImageUrl(product.images?.[0]?.imageUrl);
}

export function shouldBypassImageOptimization(src: string) {
  return src.startsWith("http://localhost")
    || src.startsWith("https://localhost")
    || src.startsWith("http://127.0.0.1")
    || src.startsWith("https://127.0.0.1");
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
  brandId?: number;
  switchTypeId?: number;
  layoutId?: number;
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
  if (query.brandId) params.set("brandId", String(query.brandId));
  if (query.switchTypeId) params.set("switchTypeId", String(query.switchTypeId));
  if (query.layoutId) params.set("layoutId", String(query.layoutId));
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

export async function getBrands() {
  try {
    return await publicFetch<Brand[]>("/api/Brand", 300);
  } catch {
    return sampleBrands;
  }
}

export async function getSwitchTypes() {
  try {
    return await publicFetch<SwitchType[]>("/api/SwitchType", 300);
  } catch {
    return sampleSwitchTypes;
  }
}

export async function getLayouts() {
  try {
    return await publicFetch<KeyboardLayout[]>("/api/Layout", 300);
  } catch {
    return sampleLayouts;
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

export const sampleBrands: Brand[] = [
  { id: 1, name: "Keyframe", description: "Premium keyboard engineering." },
  { id: 2, name: "Akko", description: "Colorful enthusiast keyboards." },
  { id: 3, name: "Keychron", description: "Wireless mechanical keyboards." },
];

export const sampleSwitchTypes: SwitchType[] = [
  { id: 1, name: "Linear", description: "Smooth key travel." },
  { id: 2, name: "Tactile", description: "Noticeable tactile bump." },
  { id: 3, name: "Clicky", description: "Audible click feedback." },
];

export const sampleLayouts: KeyboardLayout[] = [
  { id: 1, name: "60%", percentage: "60", description: "Compact layout." },
  { id: 2, name: "75%", percentage: "75", description: "Compact with function row." },
  { id: 3, name: "TKL", percentage: "80", description: "Tenkeyless layout." },
];

export const sampleProducts: Product[] = [
  {
    id: 1,
    name: "KFE-V1 Aluminum Base",
    description: "Case nhom nguyen khoi, gasket mount, hot-swap.",
    price: 3490000,
    stock: 18,
    categoryId: 1,
    categoryName: "Custom Keyboards",
    brandId: 1,
    brandName: "Keyframe",
    switchTypeId: 1,
    switchTypeName: "Linear",
    layoutId: 2,
    layoutName: "75%",
    images: [{ id: 1, imageUrl: "/images/products/keyboard-base.jpg", alt: "KFE-V1 Aluminum Base", displayOrder: 1 }],
  },
  {
    id: 2,
    name: "KFE Silent Linear Switch",
    description: "Luc nhan 45g, hanh trinh 3.8mm, pack 35 switch.",
    price: 450000,
    stock: 64,
    categoryId: 2,
    categoryName: "Switches",
    brandId: 1,
    brandName: "Keyframe",
    switchTypeId: 1,
    switchTypeName: "Linear",
    layoutId: null,
    layoutName: null,
    images: [{ id: 2, imageUrl: "/images/products/silent-linear-switch.jpg", alt: "KFE Silent Linear Switch", displayOrder: 1 }],
  },
  {
    id: 3,
    name: "BoW Minimalist Keycaps",
    description: "PBT double-shot, Cherry profile, day du layout pho bien.",
    price: 990000,
    stock: 24,
    categoryId: 3,
    categoryName: "Keycaps",
    brandId: 1,
    brandName: "Keyframe",
    switchTypeId: null,
    switchTypeName: null,
    layoutId: null,
    layoutName: null,
    images: [{ id: 3, imageUrl: "/images/products/bow-keycaps.jpg", alt: "BoW Minimalist Keycaps", displayOrder: 1 }],
  },
  {
    id: 4,
    name: "Premium Aviator Cable",
    description: "USB-C to USB-A, boc du ben, dau aviator kim loai.",
    price: 550000,
    stock: 39,
    categoryId: 4,
    categoryName: "Accessories",
    brandId: 1,
    brandName: "Keyframe",
    switchTypeId: null,
    switchTypeName: null,
    layoutId: null,
    layoutName: null,
    images: [{ id: 4, imageUrl: "/images/products/aviator-cable.jpg", alt: "Premium Aviator Cable", displayOrder: 1 }],
  },
];
