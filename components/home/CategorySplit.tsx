import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    label: "Hombre",
    href: "/hombre",
    image: "/images/products/product-street-rock-001-front-model-desktop.webp",
    kicker: "Asfalto / ruido / noche",
    copy: "Grafica pesada, siluetas urbanas y presencia de escenario."
  },
  {
    label: "Mujer",
    href: "/mujer",
    image: "/images/products/product-flame-fearless-001-front-model-desktop.webp",
    kicker: "Rojo / fuego / calle",
    copy: "Drops con contraste, textura rota y actitud propia."
  }
];

export function CategorySplit() {
  return (
    <section className="bg-charcoal py-16 md:py-24">
      <div className="rox-container">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Colecciones</p>
            <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">ENTRA POR ACTITUD</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-bone/64">Dos accesos visuales al drop. Imagen grande, decision rapida y sin vidriera blanca.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
          {categories.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative min-h-[520px] overflow-hidden bg-ink ${index === 1 ? "md:mt-16" : ""}`}
            >
              <Image
                src={item.image}
                alt={item.label}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-center opacity-88 transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0.16)_55%,rgba(8,8,8,0.34)_100%)]" />
              <div className="absolute left-5 top-5 border border-roxgold/42 bg-ink/76 px-4 py-2 text-xs font-bold uppercase tracking-rox text-roxgold">
                {item.kicker}
              </div>
              <div className="absolute bottom-6 left-5 right-5">
                <div className="inline-block rotate-[-2deg] bg-bone px-5 py-3 text-charcoal shadow-hard-red">
                  <h3 className="headline text-6xl leading-none md:text-8xl">{item.label}</h3>
                </div>
                <p className="mt-5 max-w-md text-sm leading-7 text-bone/74">{item.copy}</p>
                <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-rox text-roxgold">
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
