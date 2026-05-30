"use client";

import { Bell, Eye, LogOut, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency } from "@/lib/format";
import type {
  Brand,
  Category,
  KeyboardLayout,
  Product,
  ProductImage,
  SwitchType,
} from "@/types/api";
import type { Order } from "@/types/api";

type CatalogOptions = {
  brands: Brand[];
  categories: Category[];
  layouts: KeyboardLayout[];
  switchTypes: SwitchType[];
};

type JsonResult<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
};

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];
const LAST_SEEN_ORDER_ID_KEY = "admin:last-seen-order-id";

export function AdminNotificationBell() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastSeenOrderId, setLastSeenOrderId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = Number(localStorage.getItem(LAST_SEEN_ORDER_ID_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : null;
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadOrders({ initializeSeen }: { initializeSeen: boolean }) {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
        const json = (await res.json()) as JsonResult<Order[]>;
        if (!res.ok || !json.success || !json.data || !isActive) return;

        const sorted = sortOrdersNewestFirst(json.data);
        setOrders(sorted);

        const latestOrderId = sorted[0]?.id;
        if (initializeSeen && latestOrderId && lastSeenOrderId === null) {
          localStorage.setItem(LAST_SEEN_ORDER_ID_KEY, String(latestOrderId));
          setLastSeenOrderId(latestOrderId);
        }
      } catch {
        // Keep the shell quiet if the admin session expires; page navigation handles auth.
      }
    }

    void loadOrders({ initializeSeen: true });
    const intervalId = window.setInterval(() => {
      void loadOrders({ initializeSeen: false });
    }, 20000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [lastSeenOrderId]);

  const unseenOrders = useMemo(() => {
    if (lastSeenOrderId === null) return [];
    return orders.filter((order) => order.id > lastSeenOrderId);
  }, [lastSeenOrderId, orders]);
  const recentOrders = orders.slice(0, 5);

  function markSeen() {
    const latestOrderId = orders[0]?.id;
    if (latestOrderId) {
      localStorage.setItem(LAST_SEEN_ORDER_ID_KEY, String(latestOrderId));
      setLastSeenOrderId(latestOrderId);
    }
    setIsOpen((open) => !open);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="relative rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
        onClick={markSeen}
        type="button"
      >
        <Bell size={18} />
        {unseenOrders.length ? (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
            {unseenOrders.length > 9 ? "9+" : unseenOrders.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-950">Don hang moi</h2>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
              {unseenOrders.length} moi
            </span>
          </div>
          <div className="space-y-2">
            {recentOrders.length ? (
              recentOrders.map((order) => (
                <button
                  className="w-full rounded-lg border border-slate-100 p-3 text-left text-sm hover:bg-slate-50"
                  key={order.id}
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/admin/orders");
                  }}
                  type="button"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-slate-950">#{order.id}</span>
                    {lastSeenOrderId !== null && order.id > lastSeenOrderId ? (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-bold text-red-700">
                        Moi
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-slate-600">{order.userEmail}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatOrderCreatedAt(order.createdAt)} - {order.status}
                  </p>
                </button>
              ))
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                Chua co don hang.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    setIsPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Da dang xuat");
      router.push("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-60"
      disabled={isPending}
      onClick={logout}
      type="button"
    >
      <LogOut size={18} />
      Dang xuat
    </button>
  );
}

export function ProductAdminForm(props: CatalogOptions) {
  return <ProductForm mode="create" {...props} />;
}

export function ProductEditForm({
  product,
  ...options
}: CatalogOptions & {
  product: Product;
}) {
  return <ProductForm mode="edit" product={product} {...options} />;
}

function ProductForm({
  brands,
  categories,
  layouts,
  mode,
  product,
  switchTypes,
}: CatalogOptions & {
  mode: "create" | "edit";
  product?: Product;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  async function submit(formData: FormData) {
    setIsPending(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
      categoryId: Number(formData.get("categoryId") ?? 0),
      brandId: Number(formData.get("brandId") ?? 0),
      switchTypeId: toOptionalNumber(formData.get("switchTypeId")),
      layoutId: toOptionalNumber(formData.get("layoutId")),
    };

    try {
      const targetUrl =
        mode === "edit" && product
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products";
      const res = await fetch(targetUrl, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as JsonResult<Product>;
      if (!res.ok || !json.success) throw new Error(json.message);

      const productId = mode === "edit" ? product?.id : undefined;
      if (mode === "edit" && productId && files?.length) {
        const imageData = new FormData();
        Array.from(files).forEach((file) => imageData.append("files", file));

        const uploadRes = await fetch(`/api/admin/products/${productId}/images`, {
          method: "POST",
          body: imageData,
        });
        const uploadJson = (await uploadRes.json()) as JsonResult;
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.message ?? "Upload anh that bai");
        }
      }

      toast.success(mode === "edit" ? "Da cap nhat san pham" : "Da tao san pham");
      router.refresh();
      if (mode === "create") router.push("/admin/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the luu");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      action={submit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-5 flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
          {mode === "edit" ? "Update Catalog" : "New Catalog Item"}
        </p>
        <h2 className="text-xl font-bold text-slate-950">
          {mode === "edit" ? "Cap nhat san pham" : "Tao san pham moi"}
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-4">
          Ten san pham
          <input
            className="admin-input"
            defaultValue={product?.name}
            name="name"
            placeholder="Vi du: Keychron K2 V2"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-2">
          Gia
          <input
            className="admin-input"
            defaultValue={product?.price}
            name="price"
            placeholder="1600000"
            required
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-2">
          Ton kho
          <input
            className="admin-input"
            defaultValue={product?.stock}
            name="stock"
            placeholder="32"
            required
            type="number"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-2">
          Danh muc
          <select className="admin-input" defaultValue={product?.categoryId} name="categoryId" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-2">
          Thuong hieu
          <select className="admin-input" defaultValue={product?.brandId} name="brandId" required>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-3">
          Switch type
          <select className="admin-input" defaultValue={product?.switchTypeId ?? ""} name="switchTypeId">
            <option value="">Khong ap dung</option>
            {switchTypes.map((switchType) => (
              <option key={switchType.id} value={switchType.id}>
                {switchType.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-3">
          Layout
          <select className="admin-input" defaultValue={product?.layoutId ?? ""} name="layoutId">
            <option value="">Khong ap dung</option>
            {layouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
        </label>
        {mode === "edit" ? (
          <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-6">
            Them anh san pham
            <input
              accept="image/*"
              className="admin-input"
              multiple
              onChange={(event) => setFiles(event.target.files)}
              type="file"
            />
          </label>
        ) : null}
        <label className="grid gap-2 text-sm font-semibold text-slate-700 lg:col-span-9">
          Mo ta ngan
          <input
            className="admin-input"
            defaultValue={product?.description}
            name="description"
            placeholder="Mo ta nhanh ve san pham"
          />
        </label>
        <div className="flex items-end lg:col-span-3">
          <button
            className="h-11 w-full rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            disabled={isPending}
          >
            {mode === "edit" ? "Cap nhat" : "Tao san pham"}
          </button>
        </div>
      </div>
    </form>
  );
}

export function DeleteProductButton({ product }: { product: Product }) {
  return (
    <AdminButton
      confirmMessage={`Ban co chac muon xoa san pham "${product.name}" khong?`}
      label="Xoa"
      message="Da xoa san pham"
      method="DELETE"
      url={`/api/admin/products/${product.id}`}
    />
  );
}

export function DeleteProductImageButton({
  image,
  productId,
}: {
  image: ProductImage;
  productId: number;
}) {
  return (
    <AdminButton
      confirmMessage="Ban co chac muon xoa anh san pham nay khong?"
      iconOnly
      label="Xoa anh"
      message="Da xoa anh"
      method="DELETE"
      url={`/api/admin/products/${productId}/images/${image.id}`}
    />
  );
}

export function CategoryAdminForm() {
  return <SimpleNameForm entity="category" method="POST" successMessage="Da tao danh muc" url="/api/admin/categories" />;
}

export function CategoryEditForm({ category }: { category: Category }) {
  return (
    <SimpleNameForm
      defaultDescription={category.description}
      defaultName={category.name}
      entity="category"
      method="PUT"
      successMessage="Da cap nhat danh muc"
      url={`/api/admin/categories/${category.id}`}
    />
  );
}

export function CategoryEditDialogButton({ category }: { category: Category }) {
  return (
    <SimpleNameEditDialog
      defaultDescription={category.description}
      defaultName={category.name}
      label="Sua"
      successMessage="Da cap nhat danh muc"
      title="Cap nhat danh muc"
      url={`/api/admin/categories/${category.id}`}
    />
  );
}

export function BrandAdminForm() {
  return <SimpleNameForm entity="brand" method="POST" successMessage="Da tao brand" url="/api/admin/brands" />;
}

export function BrandEditForm({ brand }: { brand: Brand }) {
  return (
    <SimpleNameForm
      defaultDescription={brand.description}
      defaultName={brand.name}
      entity="brand"
      method="PUT"
      successMessage="Da cap nhat brand"
      url={`/api/admin/brands/${brand.id}`}
    />
  );
}

export function BrandEditDialogButton({ brand }: { brand: Brand }) {
  return (
    <SimpleNameEditDialog
      defaultDescription={brand.description}
      defaultName={brand.name}
      label="Sua"
      successMessage="Da cap nhat brand"
      title="Cap nhat brand"
      url={`/api/admin/brands/${brand.id}`}
    />
  );
}

export function SwitchTypeAdminForm() {
  return (
    <SimpleNameForm
      entity="switch type"
      method="POST"
      successMessage="Da tao switch type"
      url="/api/admin/switch-types"
    />
  );
}

export function SwitchTypeEditForm({ switchType }: { switchType: SwitchType }) {
  return (
    <SimpleNameForm
      defaultDescription={switchType.description}
      defaultName={switchType.name}
      entity="switch type"
      method="PUT"
      successMessage="Da cap nhat switch type"
      url={`/api/admin/switch-types/${switchType.id}`}
    />
  );
}

export function SwitchTypeEditDialogButton({ switchType }: { switchType: SwitchType }) {
  return (
    <SimpleNameEditDialog
      defaultDescription={switchType.description}
      defaultName={switchType.name}
      label="Sua"
      successMessage="Da cap nhat switch type"
      title="Cap nhat switch type"
      url={`/api/admin/switch-types/${switchType.id}`}
    />
  );
}

export function LayoutAdminForm() {
  return <LayoutForm mode="create" />;
}

export function LayoutEditForm({ layout }: { layout: KeyboardLayout }) {
  return <LayoutForm layout={layout} mode="edit" />;
}

export function LayoutEditDialogButton({ layout }: { layout: KeyboardLayout }) {
  return <LayoutEditDialog layout={layout} />;
}

function SimpleNameEditDialog({
  defaultDescription,
  defaultName,
  label,
  successMessage,
  title,
  url,
}: {
  defaultDescription?: string;
  defaultName?: string;
  label: string;
  successMessage: string;
  title: string;
  url: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function submit(formData: FormData) {
    setIsPending(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as JsonResult;
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success(successMessage);
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the luu");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(true)} type="button">
        {label}
      </button>
      <EditDialog onClose={() => setIsOpen(false)} open={isOpen} title={title}>
        <form action={submit} className="grid gap-3">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Ten
            <input className="admin-input" defaultValue={defaultName} name="name" required />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Mo ta
            <input className="admin-input" defaultValue={defaultDescription} name="description" />
          </label>
          <DialogActions isPending={isPending} onCancel={() => setIsOpen(false)} />
        </form>
      </EditDialog>
    </>
  );
}

function LayoutEditDialog({ layout }: { layout: KeyboardLayout }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function submit(formData: FormData) {
    setIsPending(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      percentage: String(formData.get("percentage") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    try {
      const res = await fetch(`/api/admin/layouts/${layout.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as JsonResult;
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success("Da cap nhat layout");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the luu");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(true)} type="button">
        Sua
      </button>
      <EditDialog onClose={() => setIsOpen(false)} open={isOpen} title="Cap nhat layout">
        <form action={submit} className="grid gap-3">
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Ten layout
            <input className="admin-input" defaultValue={layout.name} name="name" required />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Ty le
            <input className="admin-input" defaultValue={layout.percentage} name="percentage" required />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Mo ta
            <input className="admin-input" defaultValue={layout.description} name="description" />
          </label>
          <DialogActions isPending={isPending} onCancel={() => setIsOpen(false)} />
        </form>
      </EditDialog>
    </>
  );
}

function SimpleNameForm({
  defaultDescription,
  defaultName,
  entity,
  method,
  successMessage,
  url,
}: {
  defaultDescription?: string;
  defaultName?: string;
  entity: string;
  method: "POST" | "PUT";
  successMessage: string;
  url: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function submit(formData: FormData) {
    setIsPending(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
    };
    await submitJson({
      method,
      payload,
      router,
      successMessage,
      url,
      setIsPending,
    });
  }

  return (
    <form action={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-5">
      <input
        className="admin-input md:col-span-2"
        defaultValue={defaultName}
        name="name"
        placeholder={`Ten ${entity}`}
        required
      />
      <input
        className="admin-input md:col-span-2"
        defaultValue={defaultDescription}
        name="description"
        placeholder="Mo ta"
      />
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={isPending}>
        {method === "PUT" ? "Cap nhat" : "Tao"}
      </button>
    </form>
  );
}

function LayoutForm({
  layout,
  mode,
}: {
  layout?: KeyboardLayout;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function submit(formData: FormData) {
    setIsPending(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      percentage: String(formData.get("percentage") ?? ""),
      description: String(formData.get("description") ?? ""),
    };
    await submitJson({
      method: mode === "edit" ? "PUT" : "POST",
      payload,
      router,
      successMessage: mode === "edit" ? "Da cap nhat layout" : "Da tao layout",
      url: mode === "edit" && layout ? `/api/admin/layouts/${layout.id}` : "/api/admin/layouts",
      setIsPending,
    });
  }

  return (
    <form action={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-6">
      <input className="admin-input md:col-span-2" defaultValue={layout?.name} name="name" placeholder="Ten layout" required />
      <input className="admin-input" defaultValue={layout?.percentage} name="percentage" placeholder="%" required />
      <input className="admin-input md:col-span-2" defaultValue={layout?.description} name="description" placeholder="Mo ta" />
      <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60" disabled={isPending}>
        {mode === "edit" ? "Cap nhat" : "Tao"}
      </button>
    </form>
  );
}

export function DeleteBrandButton({ id }: { id: number }) {
  return (
    <AdminButton
      confirmMessage="Ban co chac muon xoa brand nay khong?"
      label="Xoa"
      message="Da xoa brand"
      method="DELETE"
      url={`/api/admin/brands/${id}`}
    />
  );
}

export function DeleteCategoryButton({ id }: { id: number }) {
  return (
    <AdminButton
      confirmMessage="Ban co chac muon xoa danh muc nay khong?"
      label="Xoa"
      message="Da xoa danh muc"
      method="DELETE"
      url={`/api/admin/categories/${id}`}
    />
  );
}

export function DeleteLayoutButton({ id }: { id: number }) {
  return (
    <AdminButton
      confirmMessage="Ban co chac muon xoa layout nay khong?"
      label="Xoa"
      message="Da xoa layout"
      method="DELETE"
      url={`/api/admin/layouts/${id}`}
    />
  );
}

export function DeleteSwitchTypeButton({ id }: { id: number }) {
  return (
    <AdminButton
      confirmMessage="Ban co chac muon xoa switch type nay khong?"
      label="Xoa"
      message="Da xoa switch type"
      method="DELETE"
      url={`/api/admin/switch-types/${id}`}
    />
  );
}

export function OrderStatusSelect({
  orderId,
  value,
}: {
  orderId: number;
  value: string;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(value);

  async function update(status: string) {
    setCurrentStatus(status);
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = (await res.json()) as JsonResult;
    if (!res.ok || !json.success) {
      setCurrentStatus(value);
      toast.error(json.message ?? "Khong the cap nhat");
      return;
    }
    toast.success("Da cap nhat trang thai");
    router.refresh();
  }

  return (
    <select
      className={`admin-input font-bold ${getStatusSelectTone(currentStatus)}`}
      value={currentStatus}
      onChange={(event) => update(event.target.value)}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
  );
}

export function OrderViewDialogButton({ order }: { order: Order }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <Eye size={16} />
        Xem
      </button>
      <EditDialog onClose={() => setIsOpen(false)} open={isOpen} title={`Chi tiet don #${order.id}`}>
        <div className="grid gap-4 text-sm">
          <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-slate-600 md:grid-cols-2">
            <p>
              <strong className="text-slate-950">Khach hang:</strong> {order.userEmail}
            </p>
            <p>
              <strong className="text-slate-950">Trang thai:</strong> {order.status}
            </p>
            <p>
              <strong className="text-slate-950">Thanh toan:</strong> {order.paymentMethod} - {order.paymentStatus}
            </p>
            <p>
              <strong className="text-slate-950">Ngay tao:</strong> {formatOrderCreatedAt(order.createdAt)}
            </p>
            <p>
              <strong className="text-slate-950">Nguoi nhan:</strong> {order.shippingName}
            </p>
            <p>
              <strong className="text-slate-950">SDT:</strong> {order.shippingPhone}
            </p>
            <p className="md:col-span-2">
              <strong className="text-slate-950">Dia chi:</strong> {order.shippingAddress}
            </p>
            {order.note ? (
              <p className="md:col-span-2">
                <strong className="text-slate-950">Ghi chu:</strong> {order.note}
              </p>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="grid grid-cols-[1fr_70px_120px_120px] bg-slate-50 px-3 py-2 text-xs font-bold uppercase text-slate-500">
              <span>San pham</span>
              <span>SL</span>
              <span>Don gia</span>
              <span>Tam tinh</span>
            </div>
            {order.orderDetails.map((item) => (
              <div
                className="grid grid-cols-[1fr_70px_120px_120px] items-center border-t border-slate-100 px-3 py-3"
                key={item.id}
              >
                <div>
                  <p className="font-bold text-slate-950">{item.productName}</p>
                  <p className="text-xs text-slate-500">Product ID: {item.productId}</p>
                </div>
                <span>{item.quantity}</span>
                <span>{formatCurrency(item.price)}</span>
                <span className="font-bold">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-end rounded-lg bg-slate-950 px-4 py-3 text-white">
            <span className="text-base font-bold">
              Tong cong: {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>
      </EditDialog>
    </>
  );
}

export function OrderEditDialogButton({ order }: { order: Order }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function submit(formData: FormData) {
    setIsPending(true);
    const status = String(formData.get("status") ?? order.status);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json()) as JsonResult;
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success("Da cap nhat trang thai");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the cap nhat");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button className="rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setIsOpen(true)} type="button">
        Sua
      </button>
      <EditDialog onClose={() => setIsOpen(false)} open={isOpen} title={`Cap nhat don #${order.id}`}>
        <form action={submit} className="grid gap-4">
          <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
            <p><strong className="text-slate-950">Khach hang:</strong> {order.userEmail}</p>
            <p><strong className="text-slate-950">Thanh toan:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
            <p><strong className="text-slate-950">Nguoi nhan:</strong> {order.shippingName}, {order.shippingPhone}</p>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Trang thai
            <select className="admin-input" defaultValue={order.status} name="status">
              {ORDER_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <DialogActions isPending={isPending} onCancel={() => setIsOpen(false)} />
        </form>
      </EditDialog>
    </>
  );
}

export function UserRoleSelect({ userId, value }: { userId: number; value: string }) {
  const router = useRouter();
  async function update(role: string) {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const json = (await res.json()) as JsonResult;
    if (!res.ok || !json.success) {
      toast.error(json.message ?? "Khong the cap nhat role");
      return;
    }
    toast.success("Da cap nhat role");
    router.refresh();
  }

  return (
    <select className="admin-input" defaultValue={value} onChange={(event) => update(event.target.value)}>
      <option>User</option>
      <option>Admin</option>
    </select>
  );
}

function EditDialog({
  children,
  onClose,
  open,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
}) {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <button aria-label="Dong hop thoai" className="absolute inset-0 cursor-default" onClick={onClose} type="button" />
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">
              Quick edit
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">{title}</h2>
          </div>
          <button
            aria-label="Dong"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

function DialogActions({
  isPending,
  onCancel,
}: {
  isPending: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="mt-2 flex justify-end gap-3">
      <button
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        disabled={isPending}
        onClick={onCancel}
        type="button"
      >
        Huy
      </button>
      <button
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "Dang luu..." : "Luu thay doi"}
      </button>
    </div>
  );
}

function AdminButton({
  confirmMessage,
  iconOnly = false,
  label,
  message,
  method,
  url,
}: {
  confirmMessage: string;
  iconOnly?: boolean;
  label: string;
  message: string;
  method: "DELETE";
  url: string;
}) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function run() {
    setIsPending(true);
    try {
      const res = await fetch(url, { method });
      const json = (await res.json()) as JsonResult;
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success(message);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the thuc hien");
    } finally {
      setIsPending(false);
      setIsConfirmOpen(false);
    }
  }

  return (
    <>
      <button
        aria-label={label}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
        disabled={isPending}
        onClick={() => setIsConfirmOpen(true)}
        type="button"
      >
        {iconOnly ? <Trash2 size={16} /> : label}
      </button>
      <ConfirmDialog
        description={confirmMessage}
        isPending={isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={run}
        open={isConfirmOpen}
      />
    </>
  );
}

async function submitJson({
  method,
  payload,
  router,
  setIsPending,
  successMessage,
  url,
}: {
  method: "POST" | "PUT";
  payload: Record<string, unknown>;
  router: ReturnType<typeof useRouter>;
  setIsPending: (value: boolean) => void;
  successMessage: string;
  url: string;
}) {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as JsonResult;
    if (!res.ok || !json.success) throw new Error(json.message);
    toast.success(successMessage);
    router.refresh();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Khong the luu");
  } finally {
    setIsPending(false);
  }
}

function toOptionalNumber(value: FormDataEntryValue | null) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function sortOrdersNewestFirst(orders: Order[]) {
  return [...orders].sort((a, b) => {
    const createdDiff =
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return createdDiff || b.id - a.id;
  });
}

function formatOrderCreatedAt(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getStatusSelectTone(status: string) {
  switch (status) {
    case "Pending":
      return "border-red-300 bg-red-50 text-red-700";
    case "Processing":
      return "border-amber-300 bg-amber-50 text-amber-700";
    case "Shipped":
      return "border-sky-300 bg-sky-50 text-sky-700";
    case "Completed":
      return "border-emerald-300 bg-emerald-50 text-emerald-700";
    case "Cancelled":
      return "border-slate-300 bg-slate-100 text-slate-700";
    default:
      return "border-slate-200 bg-white text-slate-700";
  }
}
