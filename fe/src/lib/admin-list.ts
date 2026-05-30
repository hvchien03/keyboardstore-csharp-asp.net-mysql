export const ADMIN_PAGE_SIZE = 3;

export function getSearchValue(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export function paginateAdminList<T>(
  items: T[],
  pageParam?: string,
  pageSize = ADMIN_PAGE_SIZE,
) {
  const page = toPositiveInt(pageParam, 1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    data: items.slice(start, start + pageSize),
    page: currentPage,
    totalCount: items.length,
    totalPages,
  };
}

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
