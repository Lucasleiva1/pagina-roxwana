import Image from "next/image";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockProducts } from "@/data/mockProducts";

export default function HombrePage() {
  return (
    <>
      <section className="relative min-h-[62svh] overflow-hidden bg-ink pt-32">
        <Image src="/images/products/product-01.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-68" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/74 to-transparent" />
        <div className="rox-container relative z-10 flex min-h-[50svh] items-end pb-14">
          <SectionHeader
            eyebrow="Coleccion hombre"
            title="ASALTO VISUAL"
            description="Prendas con peso grafico, contraste nocturno y presencia de marca."
          />
        </div>
      </section>
      <section className="bg-ink py-20">
        <div className="rox-container">
          <ProductGrid products={mockProducts} />
        </div>
      </section>
    </>
  );
}
