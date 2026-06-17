"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { OpacityControl } from "@/components/ui/OpacityControl";

const footerVisualSettingsKey = "roxwana:footer-visual-settings";
const showFooterVisualControls = false;
const defaultFooterVisualSettings = { backgroundOpacity: 90, darkLayerOpacity: 100 };

function getSavedFooterVisualSettings() {
  if (typeof window === "undefined") return defaultFooterVisualSettings;

  const saved = window.localStorage.getItem(footerVisualSettingsKey);
  if (!saved) return defaultFooterVisualSettings;

  try {
    const parsed = JSON.parse(saved) as { backgroundOpacity?: number; darkLayerOpacity?: number };

    return {
      backgroundOpacity: typeof parsed.backgroundOpacity === "number" ? parsed.backgroundOpacity : 90,
      darkLayerOpacity: typeof parsed.darkLayerOpacity === "number" ? parsed.darkLayerOpacity : 100
    };
  } catch {
    window.localStorage.removeItem(footerVisualSettingsKey);
    return defaultFooterVisualSettings;
  }
}

export function FooterBackground() {
  const [visualSettings, setVisualSettings] = useState(defaultFooterVisualSettings);
  const [saveStatus, setSaveStatus] = useState("");
  const { backgroundOpacity, darkLayerOpacity } = visualSettings;
  const opacity = backgroundOpacity / 100;

  useEffect(() => {
    const timer = window.setTimeout(() => setVisualSettings(getSavedFooterVisualSettings()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  const saveVisualSettings = () => {
    window.localStorage.setItem(footerVisualSettingsKey, JSON.stringify({ backgroundOpacity, darkLayerOpacity }));
    setSaveStatus("Guardado");
    window.setTimeout(() => setSaveStatus(""), 1800);
  };

  return (
    <>
      <Image
        src="/images/shipping/footer-roxwana-city-768.webp"
        alt=""
        fill
        sizes="100vw"
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 -z-20 object-cover object-center md:hidden"
      />
      <Image
        src="/images/shipping/footer-roxwana-city-1920.webp"
        alt=""
        fill
        sizes="100vw"
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 -z-20 hidden object-cover object-center md:block"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,8,8,0.92),rgba(8,8,8,0.5)_48%,rgba(8,8,8,0.9)),linear-gradient(0deg,rgba(8,8,8,0.72),rgba(8,8,8,0.28)_52%,rgba(8,8,8,0.8))]"
        style={{ opacity: darkLayerOpacity / 100 }}
      />
      {showFooterVisualControls ? (
        <OpacityControl
          className="right-5 top-5"
          controls={[
            { label: "Opacidad imagen", value: backgroundOpacity, onChange: (value) => setVisualSettings((current) => ({ ...current, backgroundOpacity: value })) },
            { label: "Capa oscura", value: darkLayerOpacity, onChange: (value) => setVisualSettings((current) => ({ ...current, darkLayerOpacity: value })) }
          ]}
          onSave={saveVisualSettings}
          saveStatus={saveStatus}
          title="Ajuste footer"
        />
      ) : null}
    </>
  );
}
