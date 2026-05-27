"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] flex-grow flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-display-lg-mobile font-bold text-on-surface">
        Co loi xay ra
      </h1>
      <p className="mb-6 max-w-xl text-body-md text-secondary">{error.message}</p>
      <button
        className="rounded bg-primary-container px-6 py-3 text-label-bold font-semibold text-on-primary"
        onClick={reset}
        type="button"
      >
        Thu lai
      </button>
    </main>
  );
}
