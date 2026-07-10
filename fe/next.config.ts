import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "5143",
  },
  {
    protocol: "https",
    hostname: "localhost",
    port: "7196",
  },
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "http",
    hostname: "127.0.0.1",
  },
];

addRemotePatternFromUrl(process.env.NEXT_PUBLIC_API_ASSET_URL);
addRemotePatternFromUrl(process.env.API_BASE_URL);

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;

function addRemotePatternFromUrl(value?: string) {
  if (!value) return;

  const url = new URL(value);
  const protocol = url.protocol.replace(":", "");
  if (protocol !== "http" && protocol !== "https") return;

  const exists = remotePatterns?.some(
    (pattern) =>
      pattern.protocol === protocol &&
      pattern.hostname === url.hostname &&
      pattern.port === url.port,
  );

  if (!exists) {
    remotePatterns?.push({
      protocol,
      hostname: url.hostname,
      port: url.port,
    });
  }
}
