import Link from "next/link";

export function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <main className="mx-auto w-full max-w-container-max flex-grow px-margin-mobile py-section-padding md:px-gutter">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-label-bold font-semibold uppercase tracking-wide text-primary-container">
            KEYFRAME Admin
          </p>
          <h1 className="text-display-lg-mobile font-bold text-on-surface md:text-display-lg">
            {title}
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {[
            ["/admin", "Dashboard"],
            ["/admin/products", "Products"],
            ["/admin/categories", "Categories"],
            ["/admin/orders", "Orders"],
            ["/admin/users", "Users"],
          ].map(([href, label]) => (
            <Link
              className="rounded border border-border-subtle bg-surface-white px-3 py-2 text-label-bold font-semibold text-secondary"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </main>
  );
}
