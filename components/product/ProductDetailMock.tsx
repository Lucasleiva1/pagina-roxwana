"use client";

import { useState } from "react";
import type { Product, ProductColor, ProductSize } from "@/types/product";
import { ProductGallery } from "@/components/product/ProductGallery";
import { RoxButton } from "@/components/ui/RoxButton";
import { buildSku } from "@/lib/products/buildSku";
import { buildWhatsAppMessage } from "@/lib/whatsapp/buildWhatsAppMessage";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";

export function ProductDetailMock({ product }: { product: Product }) {
  const [color, setColor] = useState<ProductColor["code"]>("NEG");
  const [size, setSize] = useState<ProductSize>("M");
  const sku = buildSku(product, color, size);
  const message = buildWhatsAppMessage(product, {
    color,
    size,
    productUrl: `/producto/${product.slug}`
  });

  return (
    <section className="bg-ink pb-20 pt-32">
      <div className="rox-container grid gap-10 lg:grid-cols-[0.95fr_1fr]">
        <ProductGallery product={product} />
        <div className="lg:pt-8">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{product.modelCode}</p>
          <h1 className="headline mt-4 text-6xl leading-none text-bone md:text-8xl">{product.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-bone/70">{product.story}</p>

          <div className="mt-8 border-y border-bone/12 py-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-rox text-steel">Color</p>
            <div className="flex gap-3">
              {product.colors.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setColor(item.code)}
                  className={`flex items-center gap-3 border px-4 py-3 text-xs font-bold uppercase tracking-rox transition ${
                    color === item.code ? "border-roxgold text-bone" : "border-bone/12 text-bone/58 hover:border-bone/40"
                  }`}
                >
                  <span className="h-4 w-4 border border-bone/24" style={{ backgroundColor: item.hex }} />
                  {item.label}
                </button>
              ))}
            </div>

            <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-rox text-steel">Talle</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(item)}
                  className={`h-11 min-w-12 border px-4 text-sm font-bold transition ${
                    size === item ? "border-roxred bg-roxred text-bone" : "border-bone/12 text-bone/70 hover:border-bone/40"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 border border-bone/12 bg-charcoal p-5">
            <p className="text-xs font-bold uppercase tracking-rox text-steel">SKU seleccionado</p>
            <p className="headline text-3xl text-bone">{sku}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <RoxButton href={buildWhatsAppUrl(message)} variant="bone" target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </RoxButton>
            <RoxButton href="/productos">Volver al shop</RoxButton>
          </div>
        </div>
      </div>
    </section>
  );
}
