"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { RoxButton } from "@/components/ui/RoxButton";
import { TextureOverlay } from "@/components/ui/TextureOverlay";
import { getPublicMediaUrl } from "@/lib/media/publicUrl";
import type { HomeSection } from "@/types/admin";

export function HeroCampaign({ section }: { section?: HomeSection | null }) {
  const reduceMotion = useReducedMotion();
  const heroImage = getPublicMediaUrl(section?.imagePath, "site-images") || "/images/hero/hero-03.png";
  const title = section?.title || "ROXWANA";
  const subtitle = section?.subtitle || "ESTILO URBANO";
  const body = section?.body || "Explorá modelos, colores y talles antes de armar tu pedido.";
  const ctaLabel = section?.ctaLabel || "Ver catálogo";
  const ctaUrl = section?.ctaUrl || "#drop-01";

  return (
    <section className="relative min-h-[94svh] overflow-hidden bg-ink pt-24 text-bone">
      <div className="absolute inset-0">
        <Image src={heroImage} alt="" fill priority sizes="100vw" className="object-cover object-[58%_center] opacity-56" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0.82)_36%,rgba(8,8,8,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_35%,rgba(8,8,8,0.66)_100%)]" />
      </div>

      <TextureOverlay intensity="strong" />

      <div className="pointer-events-none absolute right-4 top-28 h-56 w-36 rotate-[5deg] overflow-hidden bg-bone shadow-hard-red md:hidden">
        <Image src="/images/products/product-flame-fearless-001-front-model-mobile.webp" alt="" fill priority sizes="144px" className="object-cover" />
      </div>

      <div className="pointer-events-none absolute right-[-4rem] top-24 hidden h-[74svh] w-[52vw] max-w-[760px] md:block">
        <motion.div
          className="paper-edge absolute right-32 top-0 h-[58%] w-[45%] overflow-hidden bg-charcoal shadow-hard-red"
          initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <Image src="/images/products/product-street-rock-001-street-desktop.webp" alt="" fill priority sizes="360px" className="object-cover" />
        </motion.div>
        <motion.div
          className="paper-edge absolute right-0 top-24 h-[66%] w-[50%] overflow-hidden bg-bone shadow-gold-soft"
          initial={reduceMotion ? false : { opacity: 0, y: 36, rotate: 4 }}
          animate={{ opacity: 1, y: 0, rotate: 4 }}
          transition={{ duration: 0.9, delay: 0.08, ease: "easeOut" }}
        >
          <Image src="/images/products/product-flame-fearless-001-front-model-desktop.webp" alt="" fill priority sizes="420px" className="object-cover" />
        </motion.div>
        <motion.div
          className="paper-edge absolute bottom-2 right-52 h-[42%] w-[42%] overflow-hidden bg-charcoal shadow-hard-red"
          initial={reduceMotion ? false : { opacity: 0, y: 42, rotate: 7 }}
          animate={{ opacity: 1, y: 0, rotate: 7 }}
          transition={{ duration: 0.95, delay: 0.15, ease: "easeOut" }}
        >
          <Image src="/images/products/product-boyband-001-street.png" alt="" fill priority sizes="320px" className="object-cover" />
        </motion.div>
      </div>

      <div className="rox-container relative z-10 flex min-h-[calc(94svh-6rem)] items-end pb-12 md:items-center md:pb-0">
        <motion.div
          className="max-w-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-5 inline-flex items-center gap-4 border-y border-roxgold/40 py-2 text-xs font-bold uppercase tracking-rox text-roxgold">
            <span>Drop editorial</span>
            <span className="h-px w-12 bg-roxred" />
            <span>Graphic wear</span>
          </div>
          <h1 className="headline max-w-[11ch] text-7xl leading-[0.82] text-bone drop-shadow-2xl md:text-9xl lg:text-[9.4rem]">{title}</h1>
          <p className="headline mt-4 text-3xl leading-none text-bone md:text-6xl">{subtitle}</p>
          <p className="mt-5 max-w-xl text-base leading-8 text-bone/76 md:text-lg">{body}</p>
          <div className="mt-8 grid gap-3 sm:flex">
            <RoxButton href={ctaUrl} variant="bone">
              {ctaLabel}
            </RoxButton>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-5 z-10 hidden rotate-[-3deg] border border-roxgold/40 bg-ink/78 px-5 py-3 text-xs font-bold uppercase tracking-rox text-roxgold md:block">
        RXW / Wear it loud
      </div>
    </section>
  );
}
