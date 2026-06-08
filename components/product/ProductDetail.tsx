import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductSelector } from "@/components/product/ProductSelector";

export function ProductDetail({ product, settings }: { product: Product; settings: SiteSettings }) {
  return (
    <section className="bg-ink pb-20 pt-32">
      <div className="rox-container grid gap-10 lg:grid-cols-[0.95fr_1fr]">
        <ProductGallery product={product} />
        <div className="lg:pt-8">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{product.modelCode}</p>
          <h1 className="headline mt-4 text-6xl leading-none text-bone md:text-8xl">{product.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-bone/70">{product.story}</p>
          <ProductSelector product={product} settings={settings} />
        </div>
      </div>
    </section>
  );
}
