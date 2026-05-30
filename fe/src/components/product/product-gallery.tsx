"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  normalizeImageUrl,
  shouldBypassImageOptimization,
} from "@/lib/products";
import type { ProductImage } from "@/types/api";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryImages = useMemo(
    () =>
      images.length > 0
        ? images
        : [
            {
              id: 0,
              imageUrl: "",
              alt: productName,
              displayOrder: 1,
            },
          ],
    [images, productName],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = galleryImages[selectedIndex] ?? galleryImages[0];
  const selectedUrl = normalizeImageUrl(selectedImage.imageUrl);

  return (
    <div>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-border-subtle bg-surface-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <Image
          alt={selectedImage.alt || productName}
          className="object-contain"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          src={selectedUrl}
          unoptimized={shouldBypassImageOptimization(selectedUrl)}
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-4">
        {galleryImages.slice(0, 8).map((image, index) => {
          const thumbnailUrl = normalizeImageUrl(image.imageUrl);
          const isSelected = index === selectedIndex;

          return (
            <button
              aria-label={`Xem anh ${index + 1} cua ${productName}`}
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "relative aspect-square overflow-hidden rounded-lg border-2 border-primary-container bg-surface-white p-2"
                  : "relative aspect-square overflow-hidden rounded-lg border border-border-subtle bg-surface-white p-2 opacity-60 transition-opacity hover:opacity-100"
              }
              key={`${image.id}-${image.displayOrder}`}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <Image
                alt={image.alt || productName}
                className="object-contain"
                fill
                sizes="120px"
                src={thumbnailUrl}
                unoptimized={shouldBypassImageOptimization(thumbnailUrl)}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
