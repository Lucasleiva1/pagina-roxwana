"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ColorSwatch } from "@/components/product/ColorSwatch";
import { ProductQuickActions } from "@/components/product/ProductQuickActions";
import { ProductResponsiveImage } from "@/components/product/ProductResponsiveImage";
import { getProductImages } from "@/lib/products/imageColors";
import { formatPrice } from "@/lib/products/formatPrice";

function getCatalogGallery(product: Product) {
  const productImages = getProductImages(product);
  const gallery = [product.image, ...productImages.map((image) => image.url)].filter(Boolean);
  const images = Array.from(new Set(gallery));
  const hoverImage =
    productImages.find((image) => image.role === "hover")?.url ||
    productImages.find((image) => image.viewNumber === "03")?.url ||
    images.find((image) => /-03-desktop\.webp$/i.test(image)) ||
    images.find((image) => image !== product.image);

  return {
    images,
    hoverImage
  };
}

export function ProductCard({ product }: { product: Product }) {
  const gallery = useMemo(() => getCatalogGallery(product), [product]);
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
    <article className="group relative flex h-full flex-col overflow-hidden border border-bone/12 bg-ink shadow-gold-soft" data-product-model={product.modelCode}>
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-charcoal" onMouseEnter={() => setHoveringImage(true)} onMouseLeave={resetGallery}>
        <ProductResponsiveImage
          key={currentImage}
          src={currentImage}
          alt={product.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-contain object-center p-2 transition duration-500 ${hoveringImage && hoverImage ? "scale-[1.015] opacity-0" : "opacity-100 group-hover:scale-[1.015]"}`}
        />
        {hoverImage ? (
          <ProductResponsiveImage
            key={`${hoverImage}-hover`}
            src={hoverImage}
            alt={`${product.name} con modelo`}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-contain object-center p-2 transition duration-500 ${hoveringImage ? "scale-[1.015] opacity-100" : "scale-100 opacity-0"}`}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-transparent to-transparent" />
        <Link href={`/producto/${product.slug}`} className="absolute inset-0" aria-label={`Ver ${product.name}`} />

        {hasGallery ? (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center border border-roxgold/55 bg-ink/72 text-bone transition hover:bg-roxgold hover:text-charcoal"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center border border-roxgold/55 bg-ink/72 text-bone transition hover:bg-roxgold hover:text-charcoal"
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
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-rox text-steel">{product.garmentLabel}</p>
            <h3 className="headline mt-2 min-h-[4.5rem] text-3xl leading-none text-bone">{product.name}</h3>
            <p className="mt-3 text-sm font-black uppercase tracking-rox text-roxgold">{formatPrice(product.price)}</p>
          </div>
          <div className="flex shrink-0 gap-1.5 pt-1">
            {product.colors.map((color) => (
              <ColorSwatch key={color.code} color={color} size="sm" />
            ))}
          </div>
        </div>
        <p className="mt-4 max-h-24 overflow-hidden text-sm leading-6 text-bone/62">{product.story}</p>
        <ProductQuickActions product={product} viewVariant="ghost" className="mt-auto pt-6" />
      </div>
    </article>
  );
}
