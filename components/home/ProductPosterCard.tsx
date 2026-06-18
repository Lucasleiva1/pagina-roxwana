"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductQuickActions } from "@/components/product/ProductQuickActions";
import { ProductResponsiveImage } from "@/components/product/ProductResponsiveImage";
import { formatPrice } from "@/lib/products/formatPrice";
import { getImageColorCode, getImagesForColor } from "@/lib/products/imageColors";
import type { Product } from "@/types/product";

function getPosterGallery(product: Product) {
  const primaryColor = getImageColorCode(product.image);
  const preferredColor = product.colors.some((color) => color.code === primaryColor) ? primaryColor || undefined : product.colors.some((color) => color.code === "NEG") ? "NEG" : product.colors[0]?.code;
  const productImages = getImagesForColor(product, preferredColor);
  const images = productImages.map((image) => image.url);
  const gallery = [product.image, ...images].filter(Boolean);
  const hoverImage =
    productImages.find((image) => image.role === "hover")?.url ||
    productImages.find((image) => image.viewNumber === "03")?.url ||
    images.find((image) => /-03-desktop\.webp$/i.test(image)) ||
    images.find((image) => image !== product.image);

  return {
    images: Array.from(new Set(gallery)),
    hoverImage
  };
}

export function ProductPosterCard({ product }: { product: Product }) {
  const gallery = useMemo(() => getPosterGallery(product), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [hoveringImage, setHoveringImage] = useState(false);
  const currentImage = gallery.images[activeImage] || product.image;
  const hoverImage = gallery.hoverImage && gallery.hoverImage !== currentImage ? gallery.hoverImage : null;
  const hasGallery = gallery.images.length > 1;

  const goToPrevious = () => {
    setHoveringImage(false);
    setActiveImage((value) => (value - 1 + gallery.images.length) % gallery.images.length);
  };

  const goToNext = () => {
    setHoveringImage(false);
    setActiveImage((value) => (value + 1) % gallery.images.length);
  };

  const resetGallery = () => {
    setHoveringImage(false);
    setActiveImage(0);
  };

  return (
    <article className="product-poster-card group relative flex h-full flex-col overflow-hidden border border-bone/12 bg-charcoal shadow-gold-soft transition hover:border-roxgold/60 sm:min-h-[500px]" data-product-model={product.modelCode}>
      <div className="product-poster-media relative aspect-[4/3] shrink-0 overflow-hidden bg-bone sm:aspect-[3/4]" onMouseEnter={() => setHoveringImage(true)} onMouseLeave={resetGallery}>
        <ProductResponsiveImage
          key={currentImage}
          src={currentImage}
          alt={product.name}
          sizes="(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 100vw"
          className={`object-contain object-center p-1.5 transition duration-500 sm:p-2 ${hoveringImage && hoverImage ? "scale-[1.015] opacity-0" : "opacity-100 group-hover:scale-[1.015]"}`}
        />
        {hoverImage ? (
          <ProductResponsiveImage
            key={`${hoverImage}-hover`}
            src={hoverImage}
            alt={`${product.name} con modelo`}
            sizes="(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 100vw"
            className={`object-contain object-center p-1.5 transition duration-500 sm:p-2 ${hoveringImage ? "scale-[1.015] opacity-100" : "scale-100 opacity-0"}`}
          />
        ) : null}
        <Link href={`/producto/${product.slug}`} className="absolute inset-0" aria-label={`Ver ${product.name}`} />

        {hasGallery ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center border border-roxgold/55 bg-ink/72 text-bone transition hover:bg-roxgold hover:text-charcoal sm:left-3 sm:h-9 sm:w-9"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center border border-roxgold/55 bg-ink/72 text-bone transition hover:bg-roxgold hover:text-charcoal sm:right-3 sm:h-9 sm:w-9"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 right-3 z-10 border border-bone/20 bg-ink/76 px-2 py-1 text-[10px] font-bold uppercase tracking-rox text-bone/78">
              {activeImage + 1}/{gallery.images.length}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold sm:text-xs">{product.garmentLabel}</p>
        <h3 className="headline mt-1.5 text-[1.65rem] leading-none text-bone sm:mt-2 sm:min-h-[3.5rem] sm:text-3xl">{product.name}</h3>
        <p className="mt-2 text-sm font-black uppercase tracking-rox text-bone sm:mt-3">{formatPrice(product.price)}</p>
        <p className="mt-3 hidden max-h-12 overflow-hidden text-sm leading-6 text-bone/64 sm:block">{product.story}</p>

        <ProductQuickActions product={product} className="featured-product-actions mt-auto pt-3 sm:pt-5" />
      </div>
    </article>
  );
}
