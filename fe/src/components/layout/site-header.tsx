import { Search, UserRound } from "lucide-react";
import Link from "next/link";
import { CartNavLink } from "./cart-nav-link";

const navItems = [
  { label: "Trang chu", href: "/" },
  { label: "Custom Keyboards", href: "/categories/1" },
  { label: "Switches", href: "/categories/3" },
  { label: "Keycaps", href: "/categories/2" },
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
          <form action="/products" className="hidden items-center gap-2 md:flex" method="get">
            <input
              className="h-9 w-44 rounded-full border border-border-subtle bg-surface-white px-3 text-sm text-on-surface outline-none focus:border-primary-container"
              name="keyword"
              placeholder="Tim san pham"
              type="search"
            />
            <button aria-label="Tim kiem" className="transition-transform hover:scale-95" type="submit">
              <Search size={22} />
            </button>
          </form>
          <form action="/products" className="md:hidden" method="get">
            <input className="sr-only" name="keyword" placeholder="Tim san pham" type="search" />
            <button aria-label="Tim kiem" className="transition-transform hover:scale-95" type="submit">
              <Search size={22} />
            </button>
          </form>
          <Link
            aria-label="Tai khoan"
            className="transition-transform hover:scale-95"
            href="/account"
          >
            <UserRound size={22} />
          </Link>
          <CartNavLink />
        </div>
      </nav>
    </header>
  );
}
