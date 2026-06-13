import Link from "next/link";
import type { Product } from "@/types/product";
import { ProductQuickActions } from "@/components/product/ProductQuickActions";
import { ProductResponsiveImage } from "@/components/product/ProductResponsiveImage";
import { formatPrice } from "@/lib/products/formatPrice";

export function ProductCard({ product }: { product: Product }) {
  const hoverImage = product.images.find((image) => !image.isPrimary)?.url;

  return (
    <article className="group relative overflow-hidden border border-bone/12 bg-ink shadow-gold-soft">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-charcoal">
        <ProductResponsiveImage
          src={product.image}
          alt={product.name}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-center transition duration-700 group-hover:scale-105 ${hoverImage ? "object-contain p-2 group-hover:opacity-0" : "object-cover"}`}
        />
        {hoverImage ? (
          <ProductResponsiveImage
            src={hoverImage}
            alt={`${product.name} en uso`}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center opacity-0 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/82 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 border border-roxgold/40 bg-ink/70 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
          {product.modelCode}
        </span>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-rox text-steel">{product.garmentLabel}</p>
            <h3 className="headline mt-2 text-3xl leading-none text-bone">{product.name}</h3>
            <p className="mt-3 text-sm font-black uppercase tracking-rox text-roxgold">{formatPrice(product.price)}</p>
          </div>
          <div className="flex gap-1.5 pt-1">
            {product.colors.map((color) => (
              <span
                key={color.code}
                className="h-4 w-4 border border-bone/30"
                style={{ backgroundColor: color.hex || "#111111" }}
                title={color.label}
              />
            ))}
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-bone/62">{product.story}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {product.sizes.map((size) => (
            <span key={size} className="border border-bone/12 px-2 py-1 text-[10px] font-bold text-bone/70">
              {size}
            </span>
          ))}
        </div>
        <ProductQuickActions product={product} viewVariant="ghost" className="mt-6" />
      </div>
    </article>
  );
}
