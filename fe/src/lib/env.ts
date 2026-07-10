function getEnvValue(name: string, fallback?: string) {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return fallback ?? "";
}

export const API_BASE_URL = getEnvValue("API_BASE_URL", "http://localhost:5143");

export const API_ASSET_URL = getEnvValue(
  "NEXT_PUBLIC_API_ASSET_URL",
  API_BASE_URL,
);

export const SITE_URL = getEnvValue(
  "NEXT_PUBLIC_SITE_URL",
  "http://localhost:3000",
);
