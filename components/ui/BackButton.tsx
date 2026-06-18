"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type BackButtonProps = {
  mode?: "follow" | "fixed";
};

const buttonClass =
  "inline-flex min-h-11 items-center gap-3 border border-bone/24 bg-ink/88 px-4 py-3 text-xs font-bold uppercase tracking-rox text-bone/70 shadow-gold-soft backdrop-blur-md transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal";

export function BackButton({ mode = "follow" }: BackButtonProps) {
  const router = useRouter();
  const originalRef = useRef<HTMLDivElement | null>(null);
  const [showFloating, setShowFloating] = useState(false);
  const floatingVisible = mode === "fixed" || showFloating;

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    if (mode === "fixed") {
      return;
    }

    const original = originalRef.current;

    if (!original) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setShowFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );

    observer.observe(original);
    return () => observer.disconnect();
  }, [mode]);

  return (
    <>
      {mode === "follow" ? (
        <div ref={originalRef}>
          <button type="button" onClick={goBack} className={buttonClass}>
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      ) : null}

      {floatingVisible ? (
        <button
          type="button"
          onClick={goBack}
          className={`${buttonClass} fixed left-4 top-24 z-30 md:left-8`}
          aria-label="Volver"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      ) : null}
    </>
  );
}
