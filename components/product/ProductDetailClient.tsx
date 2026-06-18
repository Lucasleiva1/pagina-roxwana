"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSelector } from "@/components/product/ProductSelector";
import { BackButton } from "@/components/ui/BackButton";
import { formatPrice } from "@/lib/products/formatPrice";
import { getImageColorCode } from "@/lib/products/imageColors";

export function ProductDetailClient({ product, settings }: { product: Product; settings: SiteSettings }) {
  const primaryColor = getImageColorCode(product.image);
  const initialSelectedColor = product.colors.some((color) => color.code === primaryColor) ? primaryColor || "" : "";
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor);

  return (
    <section className="theme-shop bg-ink pb-20 pt-32">
      <div className="rox-container">
        <div className="mb-6">
          <BackButton />
        </div>
      </div>
      <div className="rox-container grid gap-10 lg:grid-cols-[0.95fr_1fr]">
        <ProductGallery product={product} selectedColor={selectedColor} />
        <div className="lg:pt-8">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{product.modelCode}</p>
          <h1 className="headline mt-4 text-6xl leading-none text-bone md:text-8xl">{product.name}</h1>
          <p className="mt-5 text-xl font-black uppercase tracking-rox text-roxgold">{formatPrice(product.price)}</p>
          <p className="mt-5 max-w-xl text-base leading-8 text-bone/70">{product.story}</p>
          <ProductSelector product={product} settings={settings} selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>
      </div>
    </section>
  );
}
