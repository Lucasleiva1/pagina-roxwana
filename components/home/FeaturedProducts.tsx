import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Product } from "@/types/product";

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section id="drop-01" className="scroll-mt-24 bg-ink py-20">
      <div className="rox-container">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Drop 01"
            title="MODELOS CON CODIGO"
            description="Catalogo real conectado a ROXWANA Command Center, con codigos visibles y consulta directa."
          />
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
