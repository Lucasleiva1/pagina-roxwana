"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSelector } from "@/components/product/ProductSelector";
import { formatPrice } from "@/lib/products/formatPrice";
import { getImageColorCode } from "@/lib/products/imageColors";

export function ProductDetailClient({ product, settings }: { product: Product; settings: SiteSettings }) {
  const router = useRouter();
  const primaryColor = getImageColorCode(product.image);
  const initialSelectedColor = product.colors.some((color) => color.code === primaryColor) ? primaryColor || "" : "";
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor);

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  return (
    <section className="theme-shop bg-ink pb-20 pt-32">
      <div className="rox-container">
        <button
          type="button"
          onClick={goBack}
          className="mb-6 inline-flex min-h-11 items-center gap-3 border border-bone/24 px-4 py-3 text-xs font-bold uppercase tracking-rox text-bone/70 transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
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
