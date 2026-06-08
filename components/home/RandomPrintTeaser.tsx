"use client";

import Image from "next/image";
import { Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RoxButton } from "@/components/ui/RoxButton";
import type { Product } from "@/types/product";

export function RandomPrintTeaser({ compact = false, products }: { compact?: boolean; products: Product[] }) {
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  const product = products[index] || products[0];

  useEffect(() => {
    if (stopped || products.length === 0) {
      return;
    }

    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % products.length);
    }, 760);

    return () => window.clearInterval(id);
  }, [products.length, stopped]);

  const stopPrint = () => {
    if (stopped) {
      setStopped(false);
      return;
    }

    setIndex(Math.floor(Math.random() * products.length));
    setStopped(true);
  };

  if (!product) {
    return null;
  }

  return (
    <section className={`bg-ink ${compact ? "py-8" : "py-20"}`}>
      <div className="rox-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeader
          eyebrow="Random print"
          title="FRENA LA ESTAMPA"
          description="Un gesto simple y comercial: rota modelos reales, frena uno y entra al detalle para elegir talle/color."
        />
        <div className="grid gap-5 md:grid-cols-[1fr_0.75fr]">
          <div className="relative min-h-[430px] overflow-hidden border border-roxgold/24 bg-charcoal shadow-hard-red">
            <Image
              key={product.image}
              src={product.image}
              alt={product.name}
              fill
              priority={compact}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{product.modelCode}</p>
              <h3 className="headline mt-2 text-5xl leading-none text-bone">{product.name}</h3>
            </div>
          </div>
          <div className="texture-panel border border-bone/12 bg-charcoal p-6">
            <div className="grid h-14 w-14 place-items-center border border-roxred/70 text-roxred">
              <Shuffle size={22} />
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-rox text-roxgold">
              {stopped ? "Modelo elegido" : "Girando estampas"}
            </p>
            <p className="headline mt-3 text-4xl leading-none text-bone">{product.model}</p>
            <p className="mt-4 text-sm leading-6 text-bone/66">{product.story}</p>
            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={stopPrint}
                className="min-h-11 border border-roxred px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone transition hover:bg-roxred"
              >
                {stopped ? "Volver a girar" : "Frenar estampa"}
              </button>
              <RoxButton href={`/producto/${product.slug}`} variant="bone">
                Elegir este modelo
              </RoxButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
