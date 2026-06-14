import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Product } from "@/types/product";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="drop-01" className="theme-shop scroll-mt-24 bg-ink py-20">
      <div className="rox-container">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            title="ELEGÍ TU MODELO"
            description="Catalogo real conectado a ROXWANA Admin, con codigos visibles, carrito y pedido por WhatsApp."
          />
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
