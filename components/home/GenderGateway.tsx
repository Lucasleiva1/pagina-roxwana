import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

const gateways = [
  {
    label: "Hombre",
    href: "/hombre",
    image: "/images/products/product-01.png",
    copy: "Remeras y buzos con presencia grafica, noche, asfalto y escenario."
  },
  {
    label: "Mujer",
    href: "/mujer",
    image: "/images/products/product-04.png",
    copy: "Drops urbanos con contraste, textura rota y actitud propia."
  }
];

export function GenderGateway() {
  return (
    <section className="bg-charcoal py-20">
      <div className="rox-container">
        <SectionHeader
          eyebrow="Colecciones"
          title="ENTRA POR ACTITUD"
          description="Dos accesos grandes, editoriales y directos. Sin vidriera blanca, sin plantilla comun."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {gateways.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group texture-panel relative min-h-[430px] overflow-hidden border border-roxgold/32 bg-ink shadow-gold-soft"
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-82 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="mb-3 h-px w-24 bg-roxred" />
                <h3 className="headline text-6xl leading-none text-bone">{item.label}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-bone/70">{item.copy}</p>
                <span className="mt-6 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-rox text-roxgold">
                  Ver drop <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
