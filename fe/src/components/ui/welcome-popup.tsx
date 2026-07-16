"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function WelcomePopup() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-modal="true"
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
      role="dialog"
    >
      <button
        aria-label="Dong popup"
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
        type="button"
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#10151f] text-white shadow-[0_24px_90px_rgba(2,8,23,0.45)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500" />
        <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-400/15 blur-3xl" />

        <div className="relative p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">
                Beta Version Notice
              </span>
              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                Chào mừng bạn đến với Keyframe
              </h2>
            </div>
            <button
              aria-label="Dong popup"
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4 text-sm leading-7 text-white/80 sm:text-base">
            <p>
              Website này hiện đang trong giai đoạn thử nghiệm nhằm đánh giá
              hiệu năng, hoàn thiện tính năng và nâng cao trải nghiệm người
              dùng.
            </p>
            <p>
              Một số chức năng có thể chưa ổn định hoặc thay đổi trong quá
              trình vận hành. Chúng tôi rất trân trọng mọi ý kiến đóng góp từ
              người dùng để cải thiện chất lượng sản phẩm.
            </p>
            <p className="text-white/95">
              Cảm ơn bạn đã đồng hành cùng Keyframe. 🚀
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10"
              onClick={() => setOpen(false)}
              type="button"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}