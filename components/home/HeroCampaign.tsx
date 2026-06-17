"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { OpacityControl } from "@/components/ui/OpacityControl";
import { RoxButton } from "@/components/ui/RoxButton";
import { TextureOverlay } from "@/components/ui/TextureOverlay";
import type { HomeSection } from "@/types/admin";

const heroVideoSources = [
  { media: "(min-width: 1280px)", mp4: "/videos/roxwana-portada-1920.mp4", webm: "/videos/roxwana-portada-1920.webm" },
  { media: "(min-width: 768px)", mp4: "/videos/roxwana-portada-1280.mp4", webm: "/videos/roxwana-portada-1280.webm" },
  { media: "(min-width: 480px)", mp4: "/videos/roxwana-portada-768.mp4", webm: "/videos/roxwana-portada-768.webm" },
  { media: undefined, mp4: "/videos/roxwana-portada-480.mp4", webm: "/videos/roxwana-portada-480.webm" }
];

const heroVisualSettingsKey = "roxwana:hero-visual-settings";
const showHeroVisualControls = false;
const defaultHeroVisualSettings = { mediaOpacity: 100, darkLayerOpacity: 100 };

function getSavedHeroVisualSettings() {
  if (typeof window === "undefined") return defaultHeroVisualSettings;

  const saved = window.localStorage.getItem(heroVisualSettingsKey);
  if (!saved) return defaultHeroVisualSettings;

  try {
    const parsed = JSON.parse(saved) as { mediaOpacity?: number; darkLayerOpacity?: number };

    return {
      mediaOpacity: typeof parsed.mediaOpacity === "number" ? parsed.mediaOpacity : 100,
      darkLayerOpacity: typeof parsed.darkLayerOpacity === "number" ? parsed.darkLayerOpacity : 100
    };
  } catch {
    window.localStorage.removeItem(heroVisualSettingsKey);
    return defaultHeroVisualSettings;
  }
}

export function HeroCampaign({ section }: { section?: HomeSection | null }) {
  const reduceMotion = useReducedMotion();
  const [visualSettings, setVisualSettings] = useState(defaultHeroVisualSettings);
  const [saveStatus, setSaveStatus] = useState("");
  const { mediaOpacity, darkLayerOpacity } = visualSettings;
  const title = section?.title || "ROXWANA";
  const subtitle = section?.subtitle || "ESTILO URBANO";
  const body = section?.body || "ExplorÃ¡ modelos, colores y talles antes de armar tu pedido.";
  const ctaLabel = "Destacados";
  const ctaUrl = section?.ctaUrl || "#drop-01";

  useEffect(() => {
    const timer = window.setTimeout(() => setVisualSettings(getSavedHeroVisualSettings()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveVisualSettings = () => {
    window.localStorage.setItem(heroVisualSettingsKey, JSON.stringify({ mediaOpacity, darkLayerOpacity }));
    setSaveStatus("Guardado");
    window.setTimeout(() => setSaveStatus(""), 1800);
  };

  return (
    <section className="theme-force-dark relative min-h-[94svh] overflow-hidden bg-ink pt-24 text-bone">
      <div className="absolute inset-0">
        {reduceMotion ? (
          <Image
            src="/videos/roxwana-portada-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ opacity: mediaOpacity / 100 }}
            className="object-cover object-[72%_center] md:object-center"
          />
        ) : (
          <video
            aria-hidden="true"
            autoPlay
            className="h-full w-full object-cover object-[72%_center] md:object-center"
            loop
            muted
            playsInline
            poster="/videos/roxwana-portada-poster.jpg"
            preload="metadata"
            style={{ opacity: mediaOpacity / 100 }}
          >
            {heroVideoSources.flatMap((source) => [
              <source key={`${source.webm}-${source.media || "base"}`} src={source.webm} type="video/webm" media={source.media} />,
              <source key={`${source.mp4}-${source.media || "base"}`} src={source.mp4} type="video/mp4" media={source.media} />
            ])}
          </video>
        )}
        <div className="absolute inset-0" style={{ opacity: darkLayerOpacity / 100 }}>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0.78)_34%,rgba(8,8,8,0.18)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_42%,rgba(8,8,8,0.58)_100%)]" />
        </div>
      </div>

      <TextureOverlay intensity="strong" />

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
      {showHeroVisualControls ? (
        <OpacityControl
          className="bottom-6 left-5 md:bottom-24"
          controls={[
            { label: "Opacidad video", value: mediaOpacity, onChange: (value) => setVisualSettings((current) => ({ ...current, mediaOpacity: value })) },
            { label: "Capa oscura", value: darkLayerOpacity, onChange: (value) => setVisualSettings((current) => ({ ...current, darkLayerOpacity: value })) }
          ]}
          onSave={saveVisualSettings}
          saveStatus={saveStatus}
          title="Ajuste portada"
        />
      ) : null}
    </section>
  );
}
