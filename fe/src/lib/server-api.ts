import { cookies } from "next/headers";
import type { ApiError } from "@/types/api";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5143";
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "keyboard_access_token";
const REFRESH_COOKIE_NAME =
  process.env.REFRESH_COOKIE_NAME ?? "keyboard_refresh_token";

type FetchOptions = Omit<RequestInit, "headers"> & {
  auth?: boolean;
  headers?: HeadersInit;
};

export async function getAccessToken() {
  return (await cookies()).get(AUTH_COOKIE_NAME)?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE_NAME)?.value;
}

export async function setAuthCookies(token: string, refreshToken: string) {
  const secure = process.env.AUTH_COOKIE_SECURE === "true";
  const store = await cookies();

  store.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  store.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(AUTH_COOKIE_NAME);
  store.delete(REFRESH_COOKIE_NAME);
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}) {
  const { auth = false, headers, ...init } = options;
  const token = auth ? await getAccessToken() : undefined;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type") && init.body) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: requestHeaders,
    cache: auth || init.method ? "no-store" : init.cache,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message?: string }).message)
        : "Request failed";

    throw {
      message,
      statusCode: res.status,
      errors:
        body && typeof body === "object" && "errors" in body
          ? (body as { errors?: Record<string, string[]> }).errors
          : undefined,
    } satisfies ApiError;
  }

  return body as T;
}

export function toErrorResponse(error: unknown) {
  const apiError = error as Partial<ApiError>;
  return Response.json(
    {
      success: false,
      message: apiError.message ?? "Co loi xay ra",
      errors: apiError.errors,
    },
    { status: apiError.statusCode ?? 500 },
  );
}
