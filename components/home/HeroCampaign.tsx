"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type MouseEvent } from "react";
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

  const handleCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!ctaUrl.startsWith("#")) {
      return;
    }

    const target = document.querySelector(ctaUrl);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", ctaUrl);
  };

  return (
    <section className="theme-force-dark relative min-h-[94svh] overflow-hidden bg-ink pt-24 text-bone">
      <div className="hero-media-layer absolute inset-0">
        <div className="hero-media-visual absolute inset-0">
          {reduceMotion ? (
            <Image
              src="/videos/roxwana-portada-poster.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ opacity: mediaOpacity / 100 }}
              className="hero-campaign-media object-cover object-center"
            />
          ) : (
            <video
              aria-hidden="true"
              autoPlay
              className="hero-campaign-media h-full w-full object-cover object-center"
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
        </div>
        <div className="absolute inset-0" style={{ opacity: darkLayerOpacity / 100 }}>
          <div className="hero-overlay-horizontal absolute inset-0 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0.78)_34%,rgba(8,8,8,0.18)_100%)]" />
          <div className="hero-overlay-vertical absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_42%,rgba(8,8,8,0.58)_100%)]" />
        </div>
      </div>

      <TextureOverlay intensity="strong" />

      <div className="rox-container relative z-10 flex min-h-[calc(94svh-6rem)] items-end pb-10 min-[380px]:pb-12 md:items-center md:pb-0">
        <motion.div
          className="w-full max-w-3xl"
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="headline max-w-full text-[clamp(2.7rem,14.5vw,4rem)] leading-[0.88] tracking-[0.06em] text-bone drop-shadow-2xl md:max-w-[11ch] md:text-9xl md:tracking-[0.14em] lg:text-[9.4rem]">
            {title}
          </h1>
          <p className="headline mt-3 text-[clamp(1.4rem,7.5vw,1.875rem)] leading-none tracking-[0.1em] text-bone min-[380px]:mt-4 md:text-6xl md:tracking-[0.14em]">
            {subtitle}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-bone/76 min-[380px]:mt-5 min-[380px]:text-base min-[380px]:leading-8 md:text-lg">{body}</p>
          <div className="mt-6 flex justify-center min-[380px]:mt-8 md:justify-start">
            <RoxButton href={ctaUrl} variant="bone" className="hero-primary-cta min-w-[13rem] rounded-md px-8" onClick={handleCtaClick}>
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
