"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { heroSlides } from "@/data/heroSlides";
import { RoxButton } from "@/components/ui/RoxButton";
import { TextureOverlay } from "@/components/ui/TextureOverlay";

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const current = heroSlides[active];
  const count = heroSlides.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % count);
    }, 6000);
    return () => window.clearInterval(id);
  }, [count]);

  const controls = useMemo(
    () => ({
      prev: () => setActive((value) => (value - 1 + count) % count),
      next: () => setActive((value) => (value + 1) % count)
    }),
    [count]
  );

  return (
    <section className="relative min-h-[92svh] overflow-hidden bg-ink">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.desktopImage}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.15, ease: "easeOut" }}
        >
          <Image
            src={current.desktopImage}
            alt=""
            fill
            priority={active === 0}
            sizes="100vw"
            className="object-cover [object-position:var(--mobile-position)] md:[object-position:var(--desktop-position)]"
            style={
              {
                "--desktop-position": current.objectPosition,
                "--mobile-position": current.mobileObjectPosition
              } as CSSProperties
            }
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/66 to-ink/16" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50 md:hidden" />
      <TextureOverlay intensity="light" />

      <div className="relative z-10 flex min-h-[92svh] items-end pb-12 pt-28 md:items-center md:pb-0">
        <div className="rox-container">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="max-w-2xl"
          >
            <div className="mb-5 flex items-center gap-4 text-xs font-bold uppercase tracking-rox text-roxgold">
              <span className="h-px w-12 bg-roxgold/70" />
              <span>{current.eyebrow}</span>
            </div>
            <h1 className="headline text-[clamp(4rem,13vw,9.8rem)] leading-[0.82] text-bone drop-shadow-2xl">
              {current.title}
            </h1>
            <p className="headline mt-3 text-3xl leading-none text-bone/92 md:text-5xl">{current.subtitle}</p>
            <p className="mt-5 max-w-xl text-base leading-7 text-bone/74 md:text-lg">{current.description}</p>
            <div className="mt-8 grid gap-3 sm:flex">
              <RoxButton href={current.primaryCtaHref} variant="bone">
                {current.primaryCtaLabel}
              </RoxButton>
              <RoxButton href={current.secondaryCtaHref}>{current.secondaryCtaLabel}</RoxButton>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex w-[min(620px,calc(100vw-32px))] -translate-x-1/2 items-center gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setActive(index)}
            className="group h-8 flex-1"
            aria-label={`Ir al slide ${index + 1}`}
          >
            <span className="block h-px w-full bg-bone/22">
              <span
                className={`block h-px bg-roxgold transition-all duration-500 ${
                  active === index ? "w-full" : "w-0 group-hover:w-1/2"
                }`}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 gap-2 md:grid">
        <button
          type="button"
          onClick={controls.prev}
          className="grid h-11 w-11 place-items-center border border-bone/20 bg-ink/45 text-bone transition hover:border-roxgold"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={controls.next}
          className="grid h-11 w-11 place-items-center border border-bone/20 bg-ink/45 text-bone transition hover:border-roxgold"
          aria-label="Slide siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
