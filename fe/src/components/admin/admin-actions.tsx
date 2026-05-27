"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, Product } from "@/types/api";

export function ProductAdminForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload/product-image", {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? "Khong the upload anh");
      return;
    }
    setImageUrl(json.data.imageUrl);
    toast.success("Da upload anh");
  }

  async function submit(formData: FormData) {
    setIsPending(true);
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      price: Number(formData.get("price") ?? 0),
      stock: Number(formData.get("stock") ?? 0),
      imageUrl: imageUrl || String(formData.get("imageUrl") ?? "") || null,
      categoryId: Number(formData.get("categoryId") ?? 0),
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success("Da tao san pham");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the tao");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={submit} className="grid gap-3 rounded-lg border border-border-subtle bg-surface-white p-5 md:grid-cols-6">
      <input className="admin-input md:col-span-2" name="name" placeholder="Ten san pham" required />
      <input className="admin-input" name="price" placeholder="Gia" required type="number" />
      <input className="admin-input" name="stock" placeholder="Ton kho" required type="number" />
      <select className="admin-input md:col-span-2" name="categoryId" required>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input className="admin-input md:col-span-2" name="imageUrl" placeholder="Image URL" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} />
      <input className="admin-input" type="file" accept="image/*" onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) void uploadImage(file);
      }} />
      <input className="admin-input md:col-span-2" name="description" placeholder="Mo ta ngan" />
      <button className="rounded bg-primary-container px-4 py-2 text-label-bold font-semibold text-on-primary disabled:opacity-60" disabled={isPending}>
        Tao
      </button>
    </form>
  );
}

export function DeleteProductButton({ product }: { product: Product }) {
  return (
    <AdminButton
      label="Xoa"
      message="Da xoa san pham"
      method="DELETE"
      url={`/api/admin/products/${product.id}`}
    />
  );
}

export function CategoryAdminForm() {
  const router = useRouter();
  async function submit(formData: FormData) {
    const payload = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
    };
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? "Khong the tao danh muc");
      return;
    }
    toast.success("Da tao danh muc");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-3 rounded-lg border border-border-subtle bg-surface-white p-5 md:grid-cols-5">
      <input className="admin-input md:col-span-2" name="name" placeholder="Ten danh muc" required />
      <input className="admin-input md:col-span-2" name="description" placeholder="Mo ta" />
      <button className="rounded bg-primary-container px-4 py-2 text-label-bold font-semibold text-on-primary">
        Tao
      </button>
    </form>
  );
}

export function DeleteCategoryButton({ id }: { id: number }) {
  return (
    <AdminButton
      label="Xoa"
      message="Da xoa danh muc"
      method="DELETE"
      url={`/api/admin/categories/${id}`}
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
  async function update(status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      toast.error(json.message ?? "Khong the cap nhat");
      return;
    }
    toast.success("Da cap nhat trang thai");
    router.refresh();
  }

  return (
    <select
      className="admin-input"
      defaultValue={value}
      onChange={(event) => update(event.target.value)}
    >
      {["Pending", "Processing", "Shipping", "Completed", "Cancelled"].map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
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
    const json = await res.json();
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

function AdminButton({
  label,
  message,
  method,
  url,
}: {
  label: string;
  message: string;
  method: "DELETE";
  url: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function run() {
    setIsPending(true);
    try {
      const res = await fetch(url, { method });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success(message);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Khong the thuc hien");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      className="rounded border border-red-200 px-3 py-2 text-label-sm font-semibold text-red-700 disabled:opacity-60"
      disabled={isPending}
      onClick={run}
      type="button"
    >
      {label}
    </button>
  );
}
