import Image from "next/image";
import type { Product } from "@/types/product";

export function ProductGallery({ product }: { product: Product }) {
  return (
    <div className="grid gap-4">
      <div className="relative aspect-[16/10] overflow-hidden border border-bone/12 bg-charcoal shadow-hard-red">
        <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[product.image, "/images/hero/hero-02.png", "/images/products/product-04.png"].map((image, index) => (
          <div key={image} className="relative aspect-[16/10] overflow-hidden border border-bone/12 bg-ink">
            <Image src={image} alt={`${product.name} vista ${index + 1}`} fill sizes="180px" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
