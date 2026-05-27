import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle bg-surface-container-lowest">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-gutter px-8 py-20 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="text-headline-md font-bold text-on-surface">
            KEYFRAME
          </span>
          <p className="text-body-md text-primary">
            © 2026 Keyframe Engineering. All rights reserved.
          </p>
        </div>

        <FooterColumn
          title="Ho tro"
          links={["Support", "Shipping", "Warranty"]}
        />
        <FooterColumn title="Cong ty" links={["Contact", "About Us", "Privacy"]} />

        <div className="flex flex-col gap-4">
          <h4 className="mb-2 text-label-bold font-semibold uppercase tracking-wide text-on-surface">
            Ban tin
          </h4>
          <form className="flex">
            <input
              className="w-full rounded-l-md border border-border-subtle bg-surface-white px-4 py-2 text-body-md outline-none transition-colors focus:border-primary-container"
              placeholder="Email cua ban"
              type="email"
            />
            <button
              aria-label="Dang ky nhan tin"
              className="rounded-r-md bg-on-surface px-4 py-2 text-on-primary transition-colors hover:bg-secondary"
              type="submit"
            >
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="mb-2 text-label-bold font-semibold uppercase tracking-wide text-on-surface">
        {title}
      </h4>
      {links.map((link) => (
        <Link
          className="text-body-md text-secondary transition-colors hover:text-primary hover:underline"
          href="/"
          key={link}
        >
          {link}
        </Link>
      ))}
    </div>
  );
}
