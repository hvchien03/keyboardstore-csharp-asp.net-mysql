"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function ProductSortSelect({ value }: { value?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateSort(sortBy: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    startTransition(() => {
      router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
    });
  }

  return (
    <select
      className="rounded border border-border-subtle bg-surface-white px-2 py-1 text-body-md text-on-surface focus:border-primary-container disabled:opacity-60"
      defaultValue={value ?? ""}
      disabled={isPending}
      onChange={(event) => updateSort(event.target.value)}
    >
      <option value="">Moi nhat</option>
      <option value="name">Ten A-Z</option>
      <option value="price_asc">Gia tang dan</option>
      <option value="price_desc">Gia giam dan</option>
      <option value="oldest">Cu nhat</option>
    </select>
  );
}
