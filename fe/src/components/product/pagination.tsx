import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type PaginationProps = {
  basePath: string;
  currentPage: number;
  searchParams?: Record<string, string | number | undefined>;
  totalPages: number;
};

export function Pagination({
  basePath,
  currentPage,
  searchParams = {},
  totalPages,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap justify-center gap-2"
    >
      <PageLink
        ariaLabel="Trang truoc"
        basePath={basePath}
        disabled={currentPage <= 1}
        page={Math.max(1, currentPage - 1)}
        searchParams={searchParams}
      >
        <ChevronLeft size={18} />
      </PageLink>

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            className="flex h-10 w-10 items-center justify-center text-secondary"
            key={`${page}-${index}`}
          >
            ...
          </span>
        ) : (
          <PageLink
            active={page === currentPage}
            basePath={basePath}
            key={page}
            page={page}
            searchParams={searchParams}
          >
            {page}
          </PageLink>
        ),
      )}

      <PageLink
        ariaLabel="Trang sau"
        basePath={basePath}
        disabled={currentPage >= totalPages}
        page={Math.min(totalPages, currentPage + 1)}
        searchParams={searchParams}
      >
        <ChevronRight size={18} />
      </PageLink>
    </nav>
  );
}

function PageLink({
  active = false,
  ariaLabel,
  basePath,
  children,
  disabled = false,
  page,
  searchParams,
}: {
  active?: boolean;
  ariaLabel?: string;
  basePath: string;
  children: React.ReactNode;
  disabled?: boolean;
  page: number;
  searchParams: Record<string, string | number | undefined>;
}) {
  const href = buildHref(basePath, page, searchParams);
  const className = active
    ? "flex h-10 min-w-10 items-center justify-center rounded border border-primary-container bg-primary-container px-3 text-white"
    : "flex h-10 min-w-10 items-center justify-center rounded border border-border-subtle px-3 text-secondary transition-colors hover:bg-surface-container-low hover:text-on-surface";

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={ariaLabel}
        className="flex h-10 min-w-10 items-center justify-center rounded border border-border-subtle px-3 text-secondary opacity-40"
      >
        {children}
      </span>
    );
  }

  return (
    <Link aria-current={active ? "page" : undefined} aria-label={ariaLabel} className={className} href={href}>
      {children}
    </Link>
  );
}

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string | number | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | "..."> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) pages.push("...");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("...");
  pages.push(totalPages);

  return pages;
}
