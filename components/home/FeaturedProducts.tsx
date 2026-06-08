import { mockProducts } from "@/data/mockProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function FeaturedProducts() {
  return (
    <section id="drop-01" className="scroll-mt-24 bg-ink py-20">
      <div className="rox-container">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Drop 01"
            title="MODELOS CON CODIGO"
            description="Mock de producto listo para conectar a catalogo real mas adelante. Hoy vende presencia y consulta directa."
          />
        </div>
        <ProductGrid products={mockProducts} />
      </div>
    </section>
  );
}
