"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { ProductPosterCard } from "@/components/home/ProductPosterCard";
import type { HomeSection } from "@/types/admin";
import type { Product, ProductGender } from "@/types/product";

type GenderFilter = Extract<ProductGender, "hombre" | "mujer">;

const categories: Array<{
  label: string;
  gender: GenderFilter;
  image: string;
  mobileImage: string;
  imagePosition: string;
  copy: string;
}> = [
  {
    label: "Hombre",
    gender: "hombre",
    image: "/images/gender-entry/hombre-urbano-20260613-desktop.webp",
    mobileImage: "/images/gender-entry/hombre-urbano-20260613-mobile.webp",
    imagePosition: "object-[50%_12%]",
    copy: "Grafica pesada, siluetas urbanas y presencia de escenario."
  },
  {
    label: "Mujer",
    gender: "mujer",
    image: "/images/gender-entry/mujer-urbana-20260613-desktop.webp",
    mobileImage: "/images/gender-entry/mujer-urbana-20260613-mobile.webp",
    imagePosition: "object-[50%_10%]",
    copy: "Drops con contraste, textura rota y actitud propia."
  }
];

export function GenderFilteredDrop({ products, dropSection, productsSection }: { products: Product[]; dropSection?: HomeSection | null; productsSection?: HomeSection | null }) {
  const [selectedGender, setSelectedGender] = useState<GenderFilter | null>(null);
  const dropRef = useRef<HTMLElement | null>(null);
  const visibleProducts = useMemo(
    () => (selectedGender ? products.filter((product) => product.gender === selectedGender) : products),
    [products, selectedGender]
  );

  const selectGender = (gender: GenderFilter) => {
    setSelectedGender((current) => (current === gender ? null : gender));
    window.setTimeout(() => dropRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <>
      <section className="bg-charcoal py-16 md:py-24">
        <div className="rox-container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{dropSection?.subtitle || "Colecciones"}</p>
              <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">{dropSection?.title || "ENTRA POR ACTITUD"}</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-bone/64">{dropSection?.body || "Dos accesos visuales al drop. Filtra los modelos abajo sin salir de esta pagina."}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-[1.05fr_0.95fr] md:gap-5">
            {categories.map((item) => {
              const active = selectedGender === item.gender;

              return (
                <button
                  key={item.gender}
                  type="button"
                  onClick={() => selectGender(item.gender)}
                  className={`gender-entry-card group relative min-h-[390px] overflow-hidden bg-ink text-left transition sm:min-h-[520px] md:min-h-[760px] ${
                    active ? "border-2 border-roxred shadow-hard-red" : "border border-transparent hover:border-roxgold/60"
                  }`}
                  aria-pressed={active}
                >
                  <picture className="absolute inset-0 block">
                    <source media="(max-width: 767px)" srcSet={item.mobileImage} />
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className={`object-cover ${item.imagePosition} opacity-88 transition duration-700 group-hover:scale-105`}
                    />
                  </picture>
                  <div className="gender-entry-overlay absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0.16)_55%,rgba(8,8,8,0.34)_100%)]" />
                  <div className="absolute bottom-4 left-2 right-2 md:bottom-6 md:left-5 md:right-5">
                    <div className="block w-full rotate-[-2deg] bg-bone px-2 py-2 text-center text-charcoal shadow-hard-red sm:inline-block sm:w-auto sm:px-3 md:px-5 md:py-3">
                      <h3 className="gender-entry-title headline whitespace-nowrap leading-none sm:text-6xl sm:tracking-[0.14em] md:text-8xl">{item.label}</h3>
                    </div>
                    <p className="mt-3 hidden max-w-md text-sm leading-7 text-bone/74 sm:block md:mt-5">{item.copy}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-rox text-roxgold md:mt-5 md:gap-3 md:text-xs">
                      {active ? "Ver todos" : "Filtrar drop"} <ArrowUpRight size={16} />
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
              <h2 className="headline max-w-4xl text-5xl leading-none text-bone md:text-8xl">{productsSection?.title || "ELEGÍ TU MODELO"}</h2>
            </div>
            <div className="border-y border-roxgold/45 py-3 text-xs font-bold uppercase tracking-rox text-bone/70 md:max-w-xs">
              {selectedGender ? "Grilla filtrada por coleccion. El resto de la pagina queda igual." : productsSection?.body || "Grilla clara para mirar modelos, recorrer imagenes y entrar al detalle sin distracciones."}
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <>
              <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductPosterCard key={product.modelCode} product={product} />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Link href="/productos" className="inline-flex min-h-11 items-center justify-center border border-bone/30 px-5 text-xs font-bold uppercase tracking-rox text-bone transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal">
                  Ver todos los productos
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-10 border-y border-roxgold/30 py-12 text-center">
              <p className="headline text-5xl text-bone">DESTACADOS EN PREPARACION</p>
              <p className="mt-3 text-sm uppercase tracking-rox text-bone/58">Marca productos como destacados desde el admin para mostrarlos aca.</p>
              <Link href="/productos" className="mt-6 inline-flex min-h-11 items-center justify-center border border-bone/30 px-5 text-xs font-bold uppercase tracking-rox text-bone transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal">
                Ver todos los productos
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
