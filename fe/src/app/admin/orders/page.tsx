import { redirect } from "next/navigation";
import Link from "next/link";
import {
  OrderEditDialogButton,
  OrderStatusSelect,
  OrderViewDialogButton,
} from "@/components/admin/admin-actions";
import {
  AdminListCount,
  AdminSearchForm,
  AdminSectionHeader,
  AdminShell,
} from "@/components/admin/admin-shell";
import { Pagination } from "@/components/product/pagination";
import { getSearchValue, paginateAdminList } from "@/lib/admin-list";
import { formatCurrency } from "@/lib/format";
import { apiFetch } from "@/lib/server-api";
import type { Order } from "@/types/api";

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"] as const;
const ORDER_PAGE_SIZE = 10;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; status?: string }>;
}) {
  const { page, q, status } = await searchParams;
  let orders: Order[] = [];
  try {
    orders = await apiFetch<Order[]>("/api/Order/admin", { auth: true });
  } catch {
    redirect("/login");
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const createdDiff =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return createdDiff || b.id - a.id;
  });
  const selectedStatus = ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])
    ? status
    : undefined;
  const statusCounts = getStatusCounts(sortedOrders);
  const keyword = getSearchValue(q);
  const statusFiltered = selectedStatus
    ? sortedOrders.filter((order) => order.status === selectedStatus)
    : sortedOrders;
  const filtered = keyword
    ? statusFiltered.filter((order) =>
        `#${order.id} ${order.userEmail} ${order.status} ${order.paymentMethod} ${order.paymentStatus} ${order.shippingName} ${order.shippingPhone} ${new Date(order.createdAt).toLocaleString("vi-VN")}`
          .toLowerCase()
          .includes(keyword),
      )
    : statusFiltered;
  const paged = paginateAdminList(filtered, page, ORDER_PAGE_SIZE);

  return (
    <AdminShell title="Orders">
      <AdminSectionHeader eyebrow="Fulfillment" title="Order Management" />
      <AdminSearchForm action="/admin/orders" placeholder="Tim ma don, email, trang thai..." q={q} />
      <OrderStatusFilters
        counts={statusCounts}
        q={q}
        selectedStatus={selectedStatus}
        total={sortedOrders.length}
      />
      <AdminListCount count={paged.data.length} total={paged.totalCount} />

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {paged.data.map((order) => (
          <div className={`grid grid-cols-1 gap-4 border-b border-l-4 border-b-slate-100 p-4 md:grid-cols-[90px_1fr_150px_130px_170px_150px_150px] md:items-center ${getOrderRowTone(order.status)}`} key={order.id}>
            <div className="flex items-center gap-2">
              <span className="font-semibold">#{order.id}</span>
              {isRecentlyCreated(order.createdAt) ? (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                  Moi
                </span>
              ) : null}
            </div>
            <span>{order.userEmail}</span>
            <span className="text-sm text-slate-500">
              {new Date(order.createdAt).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
            <span>{formatCurrency(order.totalAmount)}</span>
            <span>{order.paymentMethod} - {order.paymentStatus}</span>
            <OrderStatusSelect orderId={order.id} value={order.status} />
            <div className="flex gap-2">
              <OrderViewDialogButton order={order} />
              <OrderEditDialogButton order={order} />
            </div>
          </div>
        ))}
      </div>
      <Pagination basePath="/admin/orders" currentPage={paged.page} searchParams={{ q, status: selectedStatus }} totalPages={paged.totalPages} />
    </AdminShell>
  );
}

function OrderStatusFilters({
  counts,
  q,
  selectedStatus,
  total,
}: {
  counts: Record<string, number>;
  q?: string;
  selectedStatus?: string;
  total: number;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <StatusFilterLink
        active={!selectedStatus}
        count={total}
        href={buildOrdersHref({ q })}
        inactiveTone="border-slate-200 bg-white text-slate-700"
        label="All"
        tone="bg-slate-950 text-white border-slate-950"
      />
      {ORDER_STATUSES.map((orderStatus) => (
        <StatusFilterLink
          active={selectedStatus === orderStatus}
          count={counts[orderStatus] ?? 0}
          href={buildOrdersHref({ q, status: orderStatus })}
          inactiveTone={getStatusFilterInactiveTone(orderStatus)}
          key={orderStatus}
          label={orderStatus}
          tone={getStatusFilterTone(orderStatus)}
        />
      ))}
    </div>
  );
}

function StatusFilterLink({
  active,
  count,
  href,
  inactiveTone,
  label,
  tone,
}: {
  active: boolean;
  count: number;
  href: string;
  inactiveTone: string;
  label: string;
  tone: string;
}) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${active ? tone : inactiveTone}`}
      href={href}
    >
      <span>{label}</span>
      <span className="rounded-full bg-white/75 px-2 py-0.5 text-xs text-slate-950">
        {count}
      </span>
    </Link>
  );
}

function isRecentlyCreated(value: string) {
  const createdAt = new Date(value).getTime();
  return Number.isFinite(createdAt) && Date.now() - createdAt <= 30 * 60 * 1000;
}

function getStatusCounts(orders: Order[]) {
  return orders.reduce<Record<string, number>>((counts, order) => {
    counts[order.status] = (counts[order.status] ?? 0) + 1;
    return counts;
  }, {});
}

function buildOrdersHref({
  q,
  status,
}: {
  q?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

function getStatusFilterTone(status: string) {
  switch (status) {
    case "Pending":
      return "border-red-200 bg-red-600 text-white shadow-sm shadow-red-100";
    case "Processing":
      return "border-amber-200 bg-amber-500 text-white shadow-sm shadow-amber-100";
    case "Shipped":
      return "border-sky-200 bg-sky-600 text-white shadow-sm shadow-sky-100";
    case "Completed":
      return "border-emerald-200 bg-emerald-600 text-white shadow-sm shadow-emerald-100";
    case "Cancelled":
      return "border-slate-300 bg-slate-600 text-white shadow-sm shadow-slate-100";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function getStatusFilterInactiveTone(status: string) {
  switch (status) {
    case "Pending":
      return "border-red-200 bg-white text-red-700 shadow-sm shadow-red-50";
    case "Processing":
      return "border-amber-200 bg-white text-amber-700 shadow-sm shadow-amber-50";
    case "Shipped":
      return "border-sky-200 bg-white text-sky-700 shadow-sm shadow-sky-50";
    case "Completed":
      return "border-emerald-200 bg-white text-emerald-700 shadow-sm shadow-emerald-50";
    case "Cancelled":
      return "border-slate-300 bg-white text-slate-700 shadow-sm shadow-slate-50";
    default:
      return "border-slate-200 bg-white text-slate-700";
  }
}

function getOrderRowTone(status: string) {
  switch (status) {
    case "Pending":
      return "border-l-red-500 bg-red-50/40";
    case "Processing":
      return "border-l-amber-400";
    case "Shipped":
      return "border-l-sky-500";
    case "Completed":
      return "border-l-emerald-500";
    case "Cancelled":
      return "border-l-slate-400 bg-slate-50/60";
    default:
      return "border-l-slate-200";
  }
}
