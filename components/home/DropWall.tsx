import { ProductPosterCard } from "@/components/home/ProductPosterCard";
import type { Product } from "@/types/product";

export function DropWall({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section id="drop-01" className="theme-shop scroll-mt-24 bg-ink py-20">
        <div className="rox-container border-y border-roxgold/30 py-12 text-center">
          <p className="headline text-5xl text-bone">DROP EN PREPARACION</p>
          <p className="mt-3 text-sm uppercase tracking-rox text-bone/58">Los modelos se estan cargando.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="drop-01" className="theme-shop scroll-mt-24 overflow-hidden bg-ink py-20 md:py-28">
      <div className="rox-container">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Drop 01</p>
            <h2 className="headline mt-3 max-w-4xl text-5xl leading-none text-bone md:text-8xl">MODELOS CON CODIGO</h2>
          </div>
          <div className="border-y border-roxgold/45 py-3 text-xs font-bold uppercase tracking-rox text-bone/70 md:max-w-xs">
            Grilla clara para comparar modelos, codigos, talles y entrar a comprar sin distracciones.
          </div>
        </div>

        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductPosterCard key={product.modelCode} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
