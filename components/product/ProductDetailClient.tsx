"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSelector } from "@/components/product/ProductSelector";
import { BackButton } from "@/components/ui/BackButton";
import { formatPrice } from "@/lib/products/formatPrice";
import { getImageColorCode } from "@/lib/products/imageColors";

const colorTextAliases: Record<string, string[]> = {
  BLA: ["blanca", "blanco", "hueso", "white"],
  NEG: ["negra", "negro", "black"],
  GRI: ["gris", "gray", "grey"]
};

function normalizeColorText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function ProductDetailClient({ product, settings }: { product: Product; settings: SiteSettings }) {
  const familyProducts = product.familyProducts?.length ? product.familyProducts : [product];
  const productColorFromText = (item: Product) => {
    const tokens = new Set(normalizeColorText(`${item.name} ${item.slug}`).split(/\s+/).filter(Boolean));

    return (
      item.colors.find((color) => {
        const candidates = [color.code, color.label, ...(colorTextAliases[color.code] || [])].flatMap((value) => normalizeColorText(value).split(/\s+/));
        return candidates.some((candidate) => candidate && tokens.has(candidate));
      })?.code || ""
    );
  };
  const productColorFromImages = (item: Product) => {
    const primaryImage = item.images.find((image) => image.isPrimary) || item.images.find((image) => image.role === "cover") || item.images[0];
    return primaryImage?.colorCode || getImageColorCode(primaryImage?.url || "") || getImageColorCode(item.image);
  };
  const productColorFromFamily = (item: Product) => (item.familyColorId ? item.colors.find((color) => color.id === item.familyColorId)?.code : "");
  const familyColorCode = (item: Product) => {
    const semanticColor = productColorFromText(item);
    const imageColor = productColorFromImages(item);
    const explicitColor = productColorFromFamily(item);
    const onlyColor = item.colors.length === 1 ? item.colors[0]?.code : "";

    if (!item.parentProductId) {
      return semanticColor || imageColor || explicitColor || onlyColor || item.colors[0]?.code || "";
    }

    return explicitColor || semanticColor || imageColor || onlyColor || item.colors[0]?.code || "";
  };
  const rootColorCode = familyColorCode(product);
  const productByColor = new Map<string, Product>();
  familyProducts.forEach((item) => {
    const colorCode = familyColorCode(item);

    if (colorCode && !productByColor.has(colorCode)) {
      productByColor.set(colorCode, item);
    }
  });
  const colorByCode = new Map(product.colors.map((color) => [color.code, color]));
  familyProducts.forEach((item) => {
    const colorCode = familyColorCode(item);
    const color = item.colors.find((candidate) => candidate.code === colorCode) || item.colors[0];

    if (colorCode && color && !colorByCode.has(colorCode)) {
      colorByCode.set(colorCode, { ...color, code: colorCode });
    }
  });
  const workingColorOptions = productByColor.size > 1 ? Array.from(productByColor.keys()).map((code) => colorByCode.get(code)).filter((color): color is Product["colors"][number] => Boolean(color)) : product.colors;
  const colorOptions = rootColorCode ? [...workingColorOptions].sort((a, b) => (a.code === rootColorCode ? -1 : b.code === rootColorCode ? 1 : 0)) : workingColorOptions;
  const initialSelectedColor = colorOptions.some((color) => color.code === rootColorCode) ? rootColorCode : colorOptions[0]?.code || "";
  const [selectedColor, setSelectedColor] = useState(initialSelectedColor);
  const activeProduct = productByColor.get(selectedColor) || product;

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
          <ProductSelector product={activeProduct} colorOptions={colorOptions} settings={settings} selectedColor={selectedColor} onColorChange={setSelectedColor} />
        </div>
      </div>
    </section>
  );
}
