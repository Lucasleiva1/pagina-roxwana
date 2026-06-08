import Image from "next/image";
import { mockProducts } from "@/data/mockProducts";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function KineticPrintWall() {
  const wall = [...mockProducts, ...mockProducts];

  return (
    <section className="overflow-hidden bg-charcoal py-20">
      <div className="rox-container mb-10">
        <SectionHeader
          eyebrow="Print wall"
          title="PARED EN MOVIMIENTO"
          description="Estampas, logos y prendas como posters pegados sobre una pared oscura."
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-charcoal to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-charcoal to-transparent" />
        <div className="flex w-max animate-marquee gap-4 pr-4">
          {wall.map((product, index) => (
            <div
              key={`${product.modelCode}-${index}`}
              className="paper-edge relative h-72 w-56 overflow-hidden border border-bone/10 bg-ink shadow-hard-red md:h-96 md:w-72"
            >
              <Image src={product.image} alt="" fill sizes="288px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/82 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">{product.modelCode}</p>
                <p className="headline mt-1 text-2xl text-bone">{product.model}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
