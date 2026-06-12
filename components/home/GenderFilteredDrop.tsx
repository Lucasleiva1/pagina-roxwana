"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ProductPosterCard } from "@/components/home/ProductPosterCard";
import type { Product, ProductGender } from "@/types/product";

type GenderFilter = Extract<ProductGender, "hombre" | "mujer">;

const categories: Array<{
  label: string;
  gender: GenderFilter;
  image: string;
  kicker: string;
  copy: string;
}> = [
  {
    label: "Hombre",
    gender: "hombre",
    image: "/images/products/product-street-rock-001-front-model-desktop.webp",
    kicker: "Asfalto / ruido / noche",
    copy: "Grafica pesada, siluetas urbanas y presencia de escenario."
  },
  {
    label: "Mujer",
    gender: "mujer",
    image: "/images/products/product-flame-fearless-001-front-model-desktop.webp",
    kicker: "Rojo / fuego / calle",
    copy: "Drops con contraste, textura rota y actitud propia."
  }
];

function getDropTitle(gender: GenderFilter | null) {
  if (gender === "hombre") {
    return "MODELOS HOMBRE";
  }

  if (gender === "mujer") {
    return "MODELOS MUJER";
  }

  return "MODELOS CON CODIGO";
}

export function GenderFilteredDrop({ products }: { products: Product[] }) {
  const [selectedGender, setSelectedGender] = useState<GenderFilter | null>(null);
  const dropRef = useRef<HTMLElement | null>(null);
  const visibleProducts = useMemo(
    () => (selectedGender ? products.filter((product) => product.gender === selectedGender) : products),
    [products, selectedGender]
  );

  const selectGender = (gender: GenderFilter) => {
    setSelectedGender(gender);
    window.setTimeout(() => dropRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <>
      <section className="bg-charcoal py-16 md:py-24">
        <div className="rox-container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Colecciones</p>
              <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">ENTRA POR ACTITUD</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-bone/64">Dos accesos visuales al drop. Filtra los modelos abajo sin salir de esta pagina.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
            {categories.map((item) => {
              const active = selectedGender === item.gender;

              return (
                <button
                  key={item.gender}
                  type="button"
                  onClick={() => selectGender(item.gender)}
                  className={`group relative min-h-[520px] overflow-hidden bg-ink text-left transition ${
                    active ? "border-2 border-roxred shadow-hard-red" : "border border-transparent hover:border-roxgold/60"
                  }`}
                  aria-pressed={active}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center opacity-88 transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0.16)_55%,rgba(8,8,8,0.34)_100%)]" />
                  <div className={`absolute left-5 top-5 border bg-ink/76 px-4 py-2 text-xs font-bold uppercase tracking-rox ${active ? "border-roxred text-bone" : "border-roxgold/42 text-roxgold"}`}>
                    {active ? "Activo" : item.kicker}
                  </div>
                  <div className="absolute bottom-6 left-5 right-5">
                    <div className="inline-block rotate-[-2deg] bg-bone px-5 py-3 text-charcoal shadow-hard-red">
                      <h3 className="headline text-6xl leading-none md:text-8xl">{item.label}</h3>
                    </div>
                    <p className="mt-5 max-w-md text-sm leading-7 text-bone/74">{item.copy}</p>
                    <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-rox text-roxgold">
                      {active ? "Drop filtrado" : "Filtrar drop"} <ArrowUpRight size={16} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={dropRef} id="drop-01" className="theme-shop scroll-mt-24 overflow-hidden bg-ink py-20 md:py-28">
        <div className="rox-container">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Drop 01</p>
              <h2 className="headline mt-3 max-w-4xl text-5xl leading-none text-bone md:text-8xl">{getDropTitle(selectedGender)}</h2>
            </div>
            <div className="border-y border-roxgold/45 py-3 text-xs font-bold uppercase tracking-rox text-bone/70 md:max-w-xs">
              {selectedGender ? "Grilla filtrada por coleccion. El resto de la pagina queda igual." : "Grilla clara para mirar modelos, recorrer imagenes y entrar al detalle sin distracciones."}
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.slice(0, 8).map((product) => (
                <ProductPosterCard key={product.modelCode} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10 border-y border-roxgold/30 py-12 text-center">
              <p className="headline text-5xl text-bone">DROP EN PREPARACION</p>
              <p className="mt-3 text-sm uppercase tracking-rox text-bone/58">Todavia no hay modelos cargados para esta seleccion.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
