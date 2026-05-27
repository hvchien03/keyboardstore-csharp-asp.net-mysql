import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="flex min-h-[70vh] flex-grow flex-col items-center justify-center gap-6 px-4 text-center">
      <XCircle className="h-20 w-20 text-red-600" />
      <div>
        <h1 className="text-2xl font-bold">Thanh toan that bai</h1>
        <p className="mt-2 text-secondary">
          Giao dich khong thanh cong. Vui long thu lai.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          className="rounded-md bg-primary-container px-5 py-2.5 text-sm font-medium text-on-primary"
          href="/checkout"
        >
          Thu lai
        </Link>
        <Link className="rounded-md border px-5 py-2.5 text-sm font-medium" href="/cart">
          Quay lai gio hang
        </Link>
      </div>
    </main>
  );
}
