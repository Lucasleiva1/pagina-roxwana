import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-roxgold/24 bg-charcoal p-8 text-center">
        <p className="headline text-4xl text-bone">NO HAY MODELOS CARGADOS</p>
        <p className="mt-3 text-sm uppercase tracking-rox text-bone/58">El drop esta en preparacion.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.modelCode} product={product} />
      ))}
    </div>
  );
}
