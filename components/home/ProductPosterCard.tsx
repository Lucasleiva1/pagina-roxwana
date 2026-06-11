import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductResponsiveImage } from "@/components/product/ProductResponsiveImage";
import { RoxButton } from "@/components/ui/RoxButton";
import type { Product } from "@/types/product";

export function ProductPosterCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full min-h-[640px] flex-col overflow-hidden border border-bone/12 bg-charcoal shadow-gold-soft transition hover:border-roxgold/60">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/5] shrink-0 overflow-hidden bg-bone">
        <ProductResponsiveImage
          src={product.image}
          alt={product.name}
          sizes="(min-width: 1280px) 31vw, (min-width: 640px) 48vw, 100vw"
          className="object-contain object-center p-4 transition duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute left-4 top-4 border border-roxgold/50 bg-ink/82 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
          {product.modelCode}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{product.garmentLabel}</p>
            <h3 className="headline mt-2 min-h-[5rem] text-4xl leading-none text-bone">{product.name}</h3>
          </div>
          <div className="flex shrink-0 gap-1.5 pt-1">
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

        <p className="mt-4 max-h-[4.5rem] overflow-hidden text-sm leading-6 text-bone/64">{product.story}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {product.sizes.slice(0, 5).map((size) => (
            <span key={size} className="border border-bone/16 bg-ink/54 px-2 py-1 text-[10px] font-bold text-bone/78">
              {size}
            </span>
          ))}
        </div>

        <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-[1fr_auto]">
          <RoxButton href={`/producto/${product.slug}`} variant="bone" className="px-3">
            Ver modelo
          </RoxButton>
          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-roxgold px-4 py-3 text-xs font-bold uppercase tracking-rox text-bone transition hover:bg-roxgold hover:text-charcoal"
          >
            Talles <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
