import { Search, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Trang chu", href: "/" },
  { label: "Custom Keyboards", href: "/products" },
  { label: "Switches", href: "/categories/2" },
  { label: "Keycaps", href: "/categories/3" },
  { label: "Accessories", href: "/categories/4" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-surface-white/95 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-border-subtle px-4 py-4 shadow-sm md:px-8">
        <Link
          className="text-headline-md font-bold tracking-tight text-on-surface"
          href="/"
        >
          KEYFRAME
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              className="border-b-2 border-transparent pb-1 text-label-bold font-semibold text-secondary transition-colors hover:border-primary-container hover:text-primary-container"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-primary-container md:gap-6">
          <Link
            aria-label="Tim kiem"
            className="transition-transform hover:scale-95"
            href="/products"
          >
            <Search size={22} />
          </Link>
          <Link
            aria-label="Tai khoan"
            className="transition-transform hover:scale-95"
            href="/account"
          >
            <UserRound size={22} />
          </Link>
          <Link
            aria-label="Gio hang"
            className="relative transition-transform hover:scale-95"
            href="/cart"
          >
            <ShoppingCart size={22} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary-container text-[10px] font-medium text-on-primary">
              0
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
