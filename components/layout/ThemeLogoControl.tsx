"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Theme = "dark" | "light";

const HOLD_DURATION_MS = 3000;

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeLogoControl({
  size = 44,
  onNavigate
}: {
  size?: 44 | 48;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const timerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const cancelHold = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

  };

  const startHold = () => {
    cancelHold();
    completedRef.current = false;
    timerRef.current = window.setTimeout(() => {
      const currentTheme: Theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      applyTheme(currentTheme === "light" ? "dark" : "light");
      completedRef.current = true;
      timerRef.current = null;
      if ("vibrate" in navigator) {
        navigator.vibrate(35);
      }
    }, HOLD_DURATION_MS);
  };

  const finishHold = () => {
    const completed = completedRef.current;
    cancelHold();

    if (!completed) {
      onNavigate?.();
      router.push("/");
    }

    completedRef.current = false;
  };

  useEffect(() => {
    window.localStorage.removeItem("roxwana-theme");
    applyTheme("light");

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      className="theme-logo-control relative grid shrink-0 place-items-center rounded-full"
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        startHold();
      }}
      onPointerUp={finishHold}
      onPointerCancel={cancelHold}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
          event.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          finishHold();
        }
      }}
      onContextMenu={(event) => event.preventDefault()}
      aria-label="ROXWANA"
    >
      <Image
        src="/brand/roxwana-logo-128.webp"
        alt=""
        width={size}
        height={size}
        className={`${size === 48 ? "h-12 w-12" : "h-11 w-11"} rounded-full border border-roxgold/45 bg-bone object-contain shadow-gold-soft`}
        priority
      />
    </button>
  );
}
