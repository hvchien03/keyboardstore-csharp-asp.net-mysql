# Keyboard Store Frontend AI Prompt - Ban Tieng Viet Khong Dau

## 0. Vai tro cua ban

Ban la mot senior frontend engineer su dung Next.js 14+.

Hay xay dung frontend production-ready cho mot du an e-commerce Keyboard Store da co backend ASP.NET Core 8 Web API.

Truoc khi code, hay doc backend repository, controllers, DTOs, response shapes, route names, auth flow va payment/upload behavior. Neu backend khac voi prompt nay, backend la source of truth.

Rat quan trong ve UI: trong project se co thu muc `UI/` chua code HTML cua cac page va file `design.md` duoc lay tu Stitch AI. Hay doc toan bo thu muc `UI/` truoc khi code frontend. UI trong `UI/` la source of truth ve giao dien, layout, spacing, typography va component style.

## 1. Thong tin du an

Ten du an: Keyboard Store  
Loai du an: E-commerce ban ban phim co  
Backend: ASP.NET Core 8 Web API  
Database: MySQL  
Authentication: JWT Bearer Token voi role User/Admin  
Payment: VNPay  
Frontend: Next.js 14+ App Router, TypeScript, Tailwind CSS

Nhom nguoi dung:

1. Customer:
   - Xem san pham
   - Tim kiem va filter
   - Xem chi tiet san pham
   - Dang ky/dang nhap/dang xuat
   - Quan ly gio hang
   - Checkout
   - Thanh toan COD hoac VNPay
   - Xem lich su don hang
   - Quan ly profile

2. Admin:
   - CRUD san pham
   - CRUD danh muc
   - Quan ly don hang
   - Quan ly user
   - Upload anh san pham
   - Update trang thai don hang
   - Update role user

## 2. Huong ky thuat chinh

Su dung:

- Next.js 14+ App Router
- TypeScript strict mode
- Tailwind CSS
- Server Components mac dinh
- Client Components chi dung khi can interaction/browser API/state
- Native fetch cho server-side API calls
- React Query cho mutation va dashboard/cart interactions
- React Hook Form + Zod cho forms
- HTTP-only cookies cho JWT access token va refresh token
- Next.js Route Handlers / Server Actions lam Backend-for-Frontend
- Middleware bao ve routes
- SEO optimization cho public pages

Khong duoc:

- Luu JWT trong localStorage
- Expose access token ra browser JavaScript
- Dung any neu khong can thiet
- Hardcode API URLs
- Goi backend auth-sensitive APIs truc tiep tu browser
- Dung NextAuth neu khong duoc yeu cau them

## 3. Environment Variables

Tao `.env.example`

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_BASE_URL=http://localhost:5143
NEXT_PUBLIC_API_ASSET_URL=http://localhost:5143

AUTH_COOKIE_NAME=keyboard_access_token
REFRESH_COOKIE_NAME=keyboard_refresh_token
AUTH_COOKIE_SECURE=false

NEXT_PUBLIC_ENABLE_VNPAY=true
```

Ghi chu:

- API_BASE_URL chi dung cho server-side.
- Browser code khong duoc dung API_BASE_URL.
- Anh san pham phai duoc normalize voi NEXT_PUBLIC_API_ASSET_URL.

## 4. Backend API Contract

Kiem tra cac endpoint nay voi backend truoc khi implement.

### Auth

```http
POST /api/Auth/register
POST /api/Auth/login
POST /api/Auth/refresh-token
POST /api/Auth/logout
```

Expected response:

```ts
{
  success: boolean;
  message?: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}
```

Neu backend khac thi frontend phai adapt theo backend.

### Products

```http
GET    /api/Product
GET    /api/Product/paged
GET    /api/Product/search
GET    /api/Product/{id}
POST   /api/Product
PUT    /api/Product/{id}
DELETE /api/Product/{id}
```

### Categories

```http
GET    /api/Category
GET    /api/Category/{id}
POST   /api/Category
PUT    /api/Category/{id}
DELETE /api/Category/{id}
```

### Cart

```http
GET    /api/Cart
POST   /api/Cart/items
PUT    /api/Cart/items/{productId}
DELETE /api/Cart/items/{productId}
DELETE /api/Cart/clear
POST   /api/Cart/checkout
```

### Orders

```http
POST   /api/Order
GET    /api/Order/{id}
GET    /api/Order/my-orders
GET    /api/Order/admin
GET    /api/Order/admin/paged
GET    /api/Order/admin/{id}
PATCH  /api/Order/{id}/status
```

### Users

```http
GET    /api/User/me
PUT    /api/User/me
PUT    /api/User/me/password
GET    /api/User
GET    /api/User/{id}
PUT    /api/User/{id}/role
```

### Payment

```http
POST /api/Payment/create-vnpay-payment
GET  /api/Payment/vnpay-return
GET  /api/Payment/vnpay-ipn
GET  /api/Payment/check-payment-status/{orderId}
```

### Upload

```http
POST /api/Upload/product-image
```

## 5. Cau truc folder de xuat

```text
KeyboardStoreAPI.Frontend/
  UI/
    design.md
    *.html
  src/
    app/
    components/
    features/
    lib/
    middleware.ts
```

Frontend phai tach rieng:

- app routes
- reusable UI components
- feature modules
- api layer
- auth helpers
- SEO helpers
- utils

## 6. TypeScript Types

Tao shared types va update theo backend DTOs.

```ts
export type UserRole = "User" | "Admin";

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string | null;
  address?: string | null;
  role: UserRole;
}

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
  categoryId: number;
  category?: Category | null;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  cartItems: CartItem[];
}

export type PaymentMethod = "COD" | "VNPay";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipping"
  | "Completed"
  | "Cancelled";

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product | null;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  shippingAddress: string;
  phoneNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  orderItems: OrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

## 7. Zod Schemas

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
});

export const registerSchema = z.object({
  email: z.string().email("Email khong hop le"),
  password: z.string().min(6, "Mat khau phai co it nhat 6 ky tu"),
  username: z.string().min(3, "Username phai co it nhat 3 ky tu"),
  fullName: z.string().min(2, "Ho ten phai co it nhat 2 ky tu"),
});

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(10),
  phoneNumber: z.string().regex(/^[0-9]{10}$/),
  paymentMethod: z.enum(["COD", "VNPay"]),
});
```

## 8. Auth Architecture

Su dung Next.js lam BFF layer.

Flow:

1. Login form submit vao `/api/auth/login`
2. Next.js route handler goi backend `/api/Auth/login`
3. Neu thanh cong:
   - set HTTP-only cookies
   - luu accessToken
   - luu refreshToken
4. Browser khong duoc doc token truc tiep
5. Middleware bao ve routes
6. Logout xoa cookies

Khong duoc luu JWT trong localStorage.

## 9. API Fetching Rules

Tao `src/lib/server-fetch.ts`

Requirements:

- Tu dong attach Bearer token tu HTTP-only cookies
- Authenticated requests dung `cache: "no-store"`
- Public catalog GET requests co the dung revalidate
- Normalize API errors
- Neu 401:
  - refresh token
  - retry request
- Khong expose raw backend errors

### Implementation mau cho `server-fetch.ts`

```ts
// src/lib/server-fetch.ts
import { cookies } from "next/headers";
import { ApiError, ApiResponse } from "@/types";

const API_BASE_URL = process.env.API_BASE_URL!;
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME!;
const REFRESH_COOKIE_NAME = process.env.REFRESH_COOKIE_NAME!;

// -------------------------------------------------------------------
// Image URL normalization
// -------------------------------------------------------------------
export function normalizeImageUrl(path?: string | null): string {
  if (!path) return "/placeholder-product.png";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_ASSET_URL}${path}`;
}

// -------------------------------------------------------------------
// Internal helpers
// -------------------------------------------------------------------
function getAccessToken(): string | undefined {
  return cookies().get(AUTH_COOKIE_NAME)?.value;
}

function getRefreshToken(): string | undefined {
  return cookies().get(REFRESH_COOKIE_NAME)?.value;
}

function buildHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function attemptRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/Auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json: ApiResponse<{ accessToken: string; refreshToken: string }> =
      await res.json();

    if (!json.success || !json.data?.accessToken) return null;

    // Ghi cookies moi (chi hoat dong trong Route Handler / Server Action)
    const cookieStore = cookies();
    cookieStore.set(AUTH_COOKIE_NAME, json.data.accessToken, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
    });
    cookieStore.set(REFRESH_COOKIE_NAME, json.data.refreshToken, {
      httpOnly: true,
      secure: process.env.AUTH_COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
    });

    return json.data.accessToken;
  } catch {
    return null;
  }
}

function normalizeError(status: number, body: unknown): ApiError {
  if (
    body &&
    typeof body === "object" &&
    "message" in body
  ) {
    return {
      message: (body as ApiError).message ?? "Unknown error",
      statusCode: status,
      errors: (body as ApiError).errors,
    };
  }
  return { message: "Server error", statusCode: status };
}

// -------------------------------------------------------------------
// Core fetch wrapper
// -------------------------------------------------------------------
interface ServerFetchOptions extends Omit<RequestInit, "headers"> {
  auth?: boolean;            // Attach Bearer token?
  revalidate?: number | false; // Next.js ISR revalidate seconds. false = no-store
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {}
): Promise<ApiResponse<T>> {
  const { auth = false, revalidate = false, ...rest } = options;

  const nextOptions: RequestInit["next"] =
    revalidate === false
      ? undefined
      : { revalidate };

  const cacheOption: RequestInit["cache"] =
    revalidate === false ? "no-store" : undefined;

  let token = auth ? getAccessToken() : undefined;

  const doFetch = async (t?: string) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: buildHeaders(t),
      ...(nextOptions ? { next: nextOptions } : {}),
      ...(cacheOption ? { cache: cacheOption } : {}),
    });

  let res = await doFetch(token);

  // ---- 401: attempt refresh then retry once ----
  if (res.status === 401 && auth) {
    const newToken = await attemptRefresh();
    if (newToken) {
      res = await doFetch(newToken);
    }
  }

  // ---- Parse body ----
  let body: unknown;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    body = await res.json();
  } else {
    body = await res.text();
  }

  if (!res.ok) {
    throw normalizeError(res.status, body);
  }

  return body as ApiResponse<T>;
}

// -------------------------------------------------------------------
// Convenience wrappers
// -------------------------------------------------------------------

/** Public read (catalog pages, product detail) - ISR by default */
export function publicFetch<T>(path: string, revalidate = 60) {
  return serverFetch<T>(path, { revalidate });
}

/** Authenticated read (cart, orders, account) - always fresh */
export function authFetch<T>(
  path: string,
  init?: Omit<ServerFetchOptions, "auth" | "revalidate">
) {
  return serverFetch<T>(path, { ...init, auth: true, revalidate: false });
}

/** Authenticated mutation (POST/PUT/PATCH/DELETE) */
export function authMutate<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
  isFormData = false
) {
  const init: ServerFetchOptions = {
    method,
    auth: true,
    revalidate: false,
  };

  if (body) {
    if (isFormData) {
      // FormData: khong set Content-Type, browser/node tu set multipart
      (init as RequestInit).body = body as FormData;
      (init as ServerFetchOptions & { _skipContentType?: boolean })
        ._skipContentType = true;
    } else {
      (init as RequestInit).body = JSON.stringify(body);
    }
  }

  return serverFetch<T>(path, init);
}
```

### Su dung trong Server Components

```ts
// Server Component - catalog page (ISR 60s)
import { publicFetch } from "@/lib/server-fetch";
import { Product, ApiResponse, PaginatedResponse } from "@/types";

const res = await publicFetch<PaginatedResponse<Product>>(
  "/api/Product/paged?page=1&pageSize=12",
  60
);
const products = res.data.data;

// Server Component - authenticated (cart, orders)
import { authFetch } from "@/lib/server-fetch";
import { Cart, ApiResponse } from "@/types";

const res = await authFetch<Cart>("/api/Cart");
const cart = res.data;

// Server Action / Route Handler - mutation
import { authMutate } from "@/lib/server-fetch";

await authMutate("/api/Cart/items", "POST", {
  productId: 5,
  quantity: 1,
});
```

### Su dung trong Route Handlers (BFF)

```ts
// src/app/api/auth/login/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: { id: number; email: string; role: string };
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/api/Auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  );

  const data: ApiResponse<AuthData> = await backendRes.json();

  if (!backendRes.ok || !data.success) {
    return NextResponse.json(
      { success: false, message: data.message ?? "Login failed" },
      { status: backendRes.status }
    );
  }

  const secure = process.env.AUTH_COOKIE_SECURE === "true";
  const cookieStore = cookies();

  cookieStore.set(process.env.AUTH_COOKIE_NAME!, data.data.accessToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15, // 15 phut
  });

  cookieStore.set(process.env.REFRESH_COOKIE_NAME!, data.data.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 ngay
  });

  // Tra ve user info, KHONG tra ve token
  return NextResponse.json({
    success: true,
    data: { user: data.data.user },
  });
}
```

## 10. Route Strategy

### Public

- `/`
- `/products`
- `/products/[id]`
- `/categories/[id]`
- `/search`
- `/cart`
- `/checkout`
- `/payment/vnpay-return`

### Auth

- `/login`
- `/register`

### Account

- `/account`
- `/account/profile`
- `/account/orders`
- `/account/orders/[id]`

### Admin

- `/admin`
- `/admin/products`
- `/admin/categories`
- `/admin/orders`
- `/admin/users`

## 11. UI/UX Direction

Style:

- Clean e-commerce UI
- Sticky header
- Search bar
- Category nav
- Cart indicator
- Responsive mobile-first
- Product cards focus vao image + gia + CTA
- Checkout don gian, de dung
- Admin dashboard practical

Accessibility:

- Semantic HTML
- Keyboard navigation
- Focus states
- Form labels
- WCAG contrast


## 11.1. UI Source Of Truth From Stitch AI

Trong project co mot thu muc ten `UI/`.

Thu muc `UI/` chua:

- Cac file HTML cua tung page duoc export/lay tu Stitch AI
- File `design.md` mo ta design system, layout, component style va visual direction

Day la source of truth ve giao dien.

Bat buoc truoc khi code UI:

1. Doc file `UI/design.md`
2. Doc tat ca file `.html` trong thu muc `UI/`
3. Xac dinh moi file HTML tuong ung voi page nao trong Next.js
4. Chuyen UI HTML thanh component Next.js + TypeScript + Tailwind
5. Giu giao dien cang giong HTML/Stitch cang tot

Thu tu uu tien khi co xung dot:

1. Backend repository la source of truth cho API, DTO, endpoint, auth va payment
2. Thu muc `UI/` la source of truth cho giao dien
3. Prompt nay la guideline bo sung

Khong duoc:

- Tu y redesign UI khac voi code HTML trong `UI/`
- Bien UI thanh template e-commerce chung chung
- Bo qua `design.md`
- Chi code logic/backend ma lam UI so sai
- Doi layout, spacing, visual hierarchy neu khong can thiet

Khi implement UI:

- Giu dung layout cua HTML goc
- Giu dung section order
- Giu dung spacing, border radius, card shape, button style, typography hierarchy
- Tach HTML lap lai thanh reusable components
- Chuyen class/style sang Tailwind CSS sach se
- Neu HTML co inline CSS thi convert thanh Tailwind hoac component style hop ly
- Neu co asset/image path trong HTML thi map lai vao Next.js/public hoac normalize bang `NEXT_PUBLIC_API_ASSET_URL`
- Neu HTML la static data thi thay bang data tu backend API sau khi UI structure da dung

Mapping goi y:

- `UI/index.html` hoac `UI/home.html` -> `/`
- `UI/products.html` -> `/products`
- `UI/product-detail.html` -> `/products/[id]`
- `UI/cart.html` -> `/cart`
- `UI/checkout.html` -> `/checkout`
- `UI/login.html` -> `/login`
- `UI/register.html` -> `/register`
- `UI/account.html` -> `/account`
- `UI/orders.html` -> `/account/orders`
- `UI/admin-dashboard.html` -> `/admin`
- `UI/admin-products.html` -> `/admin/products`
- `UI/admin-categories.html` -> `/admin/categories`
- `UI/admin-orders.html` -> `/admin/orders`
- `UI/admin-users.html` -> `/admin/users`

Neu ten file HTML khac voi mapping tren, hay suy luan theo noi dung file.

Workflow bat buoc cho AI code:

1. Scan thu muc `UI/`
2. Liet ke cac file UI tim thay
3. Tom tat moi file HTML dai dien cho page/component nao
4. Tom tat design rules trong `UI/design.md`
5. Tao component plan dua tren UI goc
6. Sau do moi code Next.js frontend

UI implementation accuracy la uu tien cao.

Hay follow UI trong thu muc `UI/` truoc, sau do moi gan API/backend logic.

## 12. Cart va Checkout

Rules:

- Backend cart la source of truth khi user login
- Guest cart optional
- Optimistic UI cho add/remove/update cart
- Checkout validate bang Zod
- COD:
  - tao order
  - hien confirmation
- VNPay:
  - tao payment URL
  - redirect sang VNPay
  - verify payment status khi quay lai

### VNPay Integration Chi Tiet

#### Flow toan bo

```
Checkout Form
    |
    | paymentMethod = "VNPay"
    v
POST /api/Payment/create-vnpay-payment  (qua BFF Route Handler)
    |
    | { paymentUrl: string }
    v
router.push(paymentUrl)  ← redirect sang cong thanh toan VNPay
    |
    | (user thanh toan xong)
    v
VNPay redirect ve: /payment/vnpay-return?vnp_ResponseCode=00&vnp_TxnRef=...&vnp_Amount=...
    |
    v
Page doc query params, goi check-payment-status
    |
    +-- isPaid: true  → hien thanh cong + link xem don hang
    +-- isPaid: false → hien that bai + link quay lai gio hang
```

#### VNPay query params quan trong

| Param | Y nghia |
|---|---|
| `vnp_ResponseCode` | `"00"` = thanh cong, khac = that bai |
| `vnp_TxnRef` | Ma don hang / transaction ref |
| `vnp_Amount` | So tien * 100 (VNPay nhan x100) |
| `vnp_OrderInfo` | Mo ta don hang |
| `vnp_TransactionNo` | Ma giao dich VNPay |

#### BFF Route Handler tao payment URL

```ts
// src/app/api/payment/create-vnpay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authFetch } from "@/lib/server-fetch";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is required" },
        { status: 400 }
      );
    }

    const res = await authFetch<{ paymentUrl: string }>(
      "/api/Payment/create-vnpay-payment",
      {
        method: "POST",
        body: JSON.stringify({ orderId }),
      } as any
    );

    return NextResponse.json({ success: true, data: res.data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Failed to create payment" },
      { status: err.statusCode ?? 500 }
    );
  }
}
```

#### VNPay Return Page

```ts
// src/app/payment/vnpay-return/page.tsx
import { Suspense } from "react";
import { VNPayReturnContent } from "./vnpay-return-content";

export default function VNPayReturnPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Dang kiem tra ket qua thanh toan...</p>
    </div>}>
      <VNPayReturnContent />
    </Suspense>
  );
}
```

```ts
// src/app/payment/vnpay-return/vnpay-return-content.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type PaymentState = "loading" | "success" | "failed";

interface VNPayParams {
  vnp_ResponseCode?: string;
  vnp_TxnRef?: string;
  vnp_Amount?: string;
  vnp_TransactionNo?: string;
  vnp_OrderInfo?: string;
}

export function VNPayReturnContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<PaymentState>("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      const params: VNPayParams = {
        vnp_ResponseCode: searchParams.get("vnp_ResponseCode") ?? undefined,
        vnp_TxnRef: searchParams.get("vnp_TxnRef") ?? undefined,
        vnp_Amount: searchParams.get("vnp_Amount") ?? undefined,
        vnp_TransactionNo: searchParams.get("vnp_TransactionNo") ?? undefined,
        vnp_OrderInfo: searchParams.get("vnp_OrderInfo") ?? undefined,
      };

      // vnp_ResponseCode != "00" => that bai ngay, khong can goi backend
      if (params.vnp_ResponseCode !== "00") {
        setState("failed");
        return;
      }

      // Lay orderId tu vnp_TxnRef (tuy backend define)
      const txnRef = params.vnp_TxnRef;
      if (!txnRef) {
        setState("failed");
        return;
      }

      // vnp_TxnRef co the la orderId thuan tuy hoac co prefix - adapt theo backend
      const resolvedOrderId = txnRef.replace(/^ORDER_/, "");
      setOrderId(resolvedOrderId);

      try {
        // Goi BFF route handler de check, tranh expose token ra browser
        const res = await fetch(
          `/api/payment/check-status/${resolvedOrderId}`,
          { cache: "no-store" }
        );
        const json = await res.json();

        if (json.success && json.data?.isPaid) {
          setState("success");
        } else {
          setState("failed");
        }
      } catch {
        setState("failed");
      }
    };

    verify();
  }, [searchParams]);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg">Dang xac nhan thanh toan...</p>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold">Thanh toan thanh cong!</h1>
          <p className="mt-2 text-muted-foreground">
            Don hang #{orderId} cua ban da duoc xac nhan.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/account/orders/${orderId}`)}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Xem don hang
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded-md border px-5 py-2.5 text-sm font-medium"
          >
            Tiep tuc mua sam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <XCircle className="h-20 w-20 text-destructive" />
      <div>
        <h1 className="text-2xl font-bold">Thanh toan that bai</h1>
        <p className="mt-2 text-muted-foreground">
          Giao dich khong thanh cong. Vui long thu lai.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/checkout")}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Thu lai
        </button>
        <button
          onClick={() => router.push("/cart")}
          className="rounded-md border px-5 py-2.5 text-sm font-medium"
        >
          Quay lai gio hang
        </button>
      </div>
    </div>
  );
}
```

#### BFF Route Handler check payment status

```ts
// src/app/api/payment/check-status/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { authFetch } from "@/lib/server-fetch";

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const res = await authFetch<{ isPaid: boolean }>(
      `/api/Payment/check-payment-status/${params.orderId}`
    );
    return NextResponse.json({ success: true, data: res.data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message ?? "Cannot check payment status" },
      { status: err.statusCode ?? 500 }
    );
  }
}
```

#### Checkout form submit logic (Client Component)

```ts
// Xu ly submit trong checkout form
const handleCheckout = async (formData: CheckoutFormData) => {
  setIsSubmitting(true);
  try {
    // Buoc 1: Tao order
    const orderRes = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const order = await orderRes.json();

    if (!order.success) throw new Error(order.message);

    const orderId: number = order.data.id;

    if (formData.paymentMethod === "COD") {
      // COD: chuyen thang sang trang xac nhan
      router.push(`/account/orders/${orderId}?status=confirmed`);
      return;
    }

    // VNPay: lay payment URL
    const paymentRes = await fetch("/api/payment/create-vnpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });
    const payment = await paymentRes.json();

    if (!payment.success || !payment.data?.paymentUrl) {
      throw new Error("Khong the tao lien ket thanh toan");
    }

    // Redirect sang VNPay
    window.location.href = payment.data.paymentUrl;
  } catch (err: any) {
    toast.error(err.message ?? "Co loi xay ra, vui long thu lai");
  } finally {
    setIsSubmitting(false);
  }
};
```

## 13. SEO Requirements

Implement:

- Metadata API
- Dynamic metadata
- Product JSON-LD
- Breadcrumb JSON-LD
- sitemap.ts
- robots.ts

Disallow:

- /admin
- /account
- /checkout
- /cart

## 14. Error Handling

Implement:

- app/error.tsx
- app/not-found.tsx

Feature empty states:

- Khong co san pham
- Gio hang trong
- Khong co don hang

HTTP handling:

- 400 validation
- 401 redirect login
- 403 forbidden
- 404 not found
- 500 retry message

## 15. Initial Commands

```powershell
mkdir KeyboardStoreAPI.Frontend
cd KeyboardStoreAPI.Frontend

npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Install dependencies:

```powershell
npm install @tanstack/react-query zod react-hook-form @hookform/resolvers clsx tailwind-merge class-variance-authority lucide-react sonner
```

Optional:

```powershell
npx shadcn@latest init
```

## 16. Implementation Plan

### Phase 1

- Scan thu muc `UI/`
- Doc `UI/design.md`
- Doc cac file HTML trong `UI/`
- Mapping HTML pages sang Next.js routes
- Setup project
- Setup Tailwind
- Setup UI primitives theo Stitch/UI HTML
- Setup layouts giong UI HTML goc

### Phase 2

- Setup API layer
- Setup types
- Setup auth helpers
- Setup middleware

### Phase 3

- Login/Register
- Auth cookies
- Session helpers

### Phase 4

- Product listing
- Product detail
- Search
- Categories
- SEO

### Phase 5

- Cart
- Add/remove/update item
- Cart summary

### Phase 6

- Checkout
- COD
- VNPay integration

### Phase 7

- Account pages
- Order history
- Profile update

### Phase 8

- Admin dashboard
- CRUD products
- CRUD categories
- Orders management
- Users management

### Phase 9

- Responsive
- Loading states
- Error handling
- Typecheck
- Build

## 17. Coding Standards

Bat buoc:

- Typed APIs
- Khong luu JWT trong localStorage
- Khong expose access token
- Server Components mac dinh
- Zod cho forms
- Loading + error states
- SEO metadata
- next/image
- Environment variables
- Role protection
- Responsive UI
- npm run build pass

## 18. Final Deliverables

Can deliver:

1. Complete Next.js frontend
2. README.md
3. .env.example
4. Auth voi HTTP-only cookies
5. Product browsing
6. Cart + checkout
7. VNPay integration
8. Account pages
9. Admin dashboard
10. Responsive UI
11. SEO implementation

## 19. Important Instruction

Hay doc backend repository truoc khi code.

Hay doc thu muc `UI/` truoc khi code giao dien. Trong do `UI/design.md` va cac file `.html` la source of truth de lam UI theo Stitch AI.

Neu backend DTOs, response shapes, field names hoac endpoints khac voi prompt nay thi frontend phai adapt theo backend that.

Neu UI trong prompt nay khac voi `UI/design.md` hoac code HTML trong thu muc `UI/`, hay uu tien `UI/design.md` va HTML trong thu muc `UI/`.
