"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product";
import { ProductResponsiveImage } from "@/components/product/ProductResponsiveImage";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length > 0 ? product.images : [{ url: product.image, alt: product.name, sortOrder: 0, isPrimary: true }];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] || images[0];
  const hasMultipleImages = images.length > 1;

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[4/5] overflow-hidden border border-bone/12 bg-charcoal shadow-hard-red">
        <ProductResponsiveImage
          key={activeImage.url}
          src={activeImage.url}
          alt={activeImage.alt || product.name}
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-bone/30 bg-ink/72 text-bone transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal"
              aria-label="Imagen anterior"
              title="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-bone/30 bg-ink/72 text-bone transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal"
              aria-label="Imagen siguiente"
              title="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 right-4 border border-roxgold/40 bg-ink/76 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
              {activeIndex + 1}/{images.length}
            </div>
          </>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {images.slice(0, 6).map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-[16/10] overflow-hidden border bg-ink transition ${
              index === activeIndex ? "border-roxgold" : "border-bone/12 hover:border-roxgold"
            }`}
            aria-label={`Ver imagen ${index + 1} de ${product.name}`}
          >
            <Image src={image.url} alt={image.alt || `${product.name} vista ${index + 1}`} fill sizes="180px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
