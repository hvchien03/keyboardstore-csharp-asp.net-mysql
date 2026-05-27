import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-grow flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-display-lg-mobile font-bold text-on-surface">
        Khong tim thay
      </h1>
      <p className="mb-6 text-body-md text-secondary">
        Trang hoac san pham ban dang tim khong ton tai.
      </p>
      <Link
        className="rounded bg-primary-container px-6 py-3 text-label-bold font-semibold text-on-primary"
        href="/"
      >
        Ve trang chu
      </Link>
    </main>
  );
}
