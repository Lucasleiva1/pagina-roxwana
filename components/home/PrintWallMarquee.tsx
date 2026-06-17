"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/product";

const posterShapes = [
  "h-80 w-60 rotate-[-3deg] md:h-[26rem] md:w-72",
  "h-72 w-72 rotate-[2deg] md:h-96 md:w-80",
  "h-80 w-56 rotate-[4deg] md:h-[28rem] md:w-64",
  "h-72 w-64 rotate-[-1deg] md:h-[24rem] md:w-80"
];

export function PrintWallMarquee({ products }: { products: Product[] }) {
  const [paused, setPaused] = useState(false);
  const source = products.length > 0 ? products : [];
  const wall = [...source, ...source];

  if (source.length === 0) {
    return null;
  }

  return (
    <section className="theme-force-dark overflow-hidden bg-charcoal py-20 md:py-24">
      <div className="rox-container mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Print wall</p>
          <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">PARED DE POSTERS</h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-bone/64">Estampas, codigos y prendas como afiches pegados sobre una pared oscura.</p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-charcoal to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-charcoal to-transparent" />
        <div
          className={`rox-marquee-track flex w-max gap-5 pr-5 ${paused ? "rox-marquee-paused" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          {wall.map((product, index) => (
            <Link
              key={`${product.modelCode}-${index}`}
              href={`/producto/${product.slug}`}
              className={`paper-edge group/poster relative block shrink-0 overflow-hidden bg-ink shadow-hard-red transition duration-300 hover:-translate-y-2 hover:shadow-gold-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-roxgold ${posterShapes[index % posterShapes.length]}`}
              aria-label={`Ver detalle de ${product.name}`}
            >
              <Image src={product.image} alt="" fill sizes="320px" className="object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0.10)_58%,rgba(8,8,8,0.26)_100%)] transition duration-300 group-hover/poster:bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0.02)_58%,rgba(8,8,8,0.18)_100%)]" />
              <div className="absolute left-4 top-4 border border-roxgold/44 bg-ink/74 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
                {product.modelCode}
              </div>
              <div className="absolute right-4 top-4 translate-y-1 border border-roxgold bg-roxgold px-3 py-2 text-[10px] font-black uppercase tracking-rox text-charcoal opacity-0 transition duration-300 group-hover/poster:translate-y-0 group-hover/poster:opacity-100 group-focus-visible/poster:translate-y-0 group-focus-visible/poster:opacity-100">
                Ver prenda
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="headline text-3xl leading-none text-bone">{product.model}</p>
                <p className="mt-2 text-xs uppercase tracking-rox text-bone/58">{product.garmentLabel}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
