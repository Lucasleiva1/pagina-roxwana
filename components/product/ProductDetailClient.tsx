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
  const familyProducts = product.familyProducts?.length ? product.familyProducts : [product];
  const familyColorCode = (item: Product) => {
    const explicitColor = item.familyColorId ? item.colors.find((color) => color.id === item.familyColorId)?.code : "";
    const imageColor = getImageColorCode(item.image);
    return explicitColor || imageColor || item.colors[0]?.code || "";
  };
  const rootColorCode = familyColorCode(product);
  const initialSelectedColor = product.colors.some((color) => color.code === rootColorCode) ? rootColorCode : product.colors[0]?.code || "";
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor);
  const activeProduct = familyProducts.find((item) => familyColorCode(item) === selectedColor) || product;

  return (
    <section className="theme-shop bg-ink pb-32 pt-28">
      <div className="rox-container">
        <div className="mb-5">
          <BackButton />
        </div>
      </div>
      <div className="rox-container grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,23rem)] lg:items-start xl:grid-cols-[minmax(0,1fr)_minmax(22rem,25rem)]">
        <ProductGallery product={activeProduct} selectedColor={selectedColor} />
        <div className="lg:pt-4">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{activeProduct.modelCode}</p>
          <h1 className="headline mt-3 text-5xl leading-none text-bone md:text-6xl xl:text-8xl">{activeProduct.name}</h1>
          <p className="mt-4 text-lg font-black uppercase tracking-rox text-roxgold">{formatPrice(activeProduct.price)}</p>
          <p className="mt-4 text-sm leading-6 text-bone/70 xl:text-base xl:leading-7">{activeProduct.story}</p>
          <ProductSelector product={activeProduct} colorOptions={product.colors} settings={settings} selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>
      </div>
    </section>
  );
}
