import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "KEYFRAME - Ban phim co cao cap",
    template: "%s | KEYFRAME",
  },
  description:
    "Cua hang ban phim co, switch, keycap va phu kien theo phong cach toi gian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-on-background">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
