import Image from "next/image";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { searchProducts } from "@/lib/products/queries";

export const dynamic = "force-dynamic";

export default async function MujerPage() {
  const products = await searchProducts({ gender: "mujer" });

  return (
    <>
      <section className="relative min-h-[62svh] overflow-hidden bg-ink pt-32">
        <Image src="/images/products/product-04.png" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-72" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-transparent" />
        <div className="rox-container relative z-10 flex min-h-[50svh] items-end pb-14">
          <SectionHeader
            eyebrow="Coleccion mujer"
            title="IDENTIDAD PROPIA"
            description="Street rock grafico, rojo como golpe visual y dorado como detalle fino."
          />
        </div>
      </section>
      <section className="bg-ink py-20">
        <div className="rox-container">
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
