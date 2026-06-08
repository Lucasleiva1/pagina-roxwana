import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockProducts } from "@/data/mockProducts";

export default function ProductosPage() {
  return (
    <section className="bg-ink pb-20 pt-32">
      <div className="rox-container">
        <SectionHeader
          eyebrow="Shop"
          title="TODOS LOS MODELOS"
          description="Catalogo mock para consulta directa. La estructura queda lista para conectar Supabase mas adelante."
        />
        <div className="mt-10">
          <ProductGrid products={mockProducts} />
        </div>
      </div>
    </section>
  );
}
