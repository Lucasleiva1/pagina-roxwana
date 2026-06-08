"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "roxwana-theme";
const listeners = new Set<() => void>();

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

function getSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  const onStorage = () => listener();
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function setStoredTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore<Theme>(subscribe, getSnapshot, () => "dark");
  const isLight = theme === "light";
  const label = isLight ? "Activar modo oscuro" : "Activar modo claro";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = isLight ? "dark" : "light";
    setStoredTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle border border-bone/12 text-bone/78 transition hover:border-roxred hover:text-bone ${
        compact
          ? "flex h-11 w-full items-center justify-center gap-3 px-4 text-xs font-bold uppercase tracking-rox"
          : "grid h-10 w-10 place-items-center"
      }`}
      aria-label={label}
      title={label}
    >
      {isLight ? <Moon size={18} /> : <Sun size={18} />}
      {compact ? <span>{isLight ? "Modo oscuro" : "Modo claro"}</span> : null}
    </button>
  );
}
