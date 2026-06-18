"use client";

import { useEffect, useState } from "react";

type SavedWhatsAppNotice = {
  url: string;
  message: string;
};

const STORAGE_KEY = "roxwana-last-whatsapp";

export function saveCartWhatsAppNotice(input: SavedWhatsAppNotice) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(input));
  } catch {
    // If storage is unavailable, the opened WhatsApp tab is still the primary path.
  }
}

export function CartWhatsAppNotice({ initialNotice = null }: { initialNotice?: SavedWhatsAppNotice | null }) {
  const [notice, setNotice] = useState<SavedWhatsAppNotice | null>(initialNotice);

  useEffect(() => {
    if (initialNotice) {
      return undefined;
    }

    let timer: number | null = null;

    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return undefined;
      }

      const parsed = JSON.parse(saved) as Partial<SavedWhatsAppNotice>;

      if (typeof parsed.url === "string" && typeof parsed.message === "string") {
        timer = window.setTimeout(() => setNotice({ url: parsed.url as string, message: parsed.message as string }), 0);
      }
    } catch {
      timer = window.setTimeout(() => setNotice(null), 0);
    }

    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [initialNotice]);

  if (!notice) {
    return null;
  }

  return (
    <div className="cart-whatsapp-notice border border-roxred/50 bg-roxred/10 p-4 text-sm leading-6 text-bone">
      <p>{notice.message}</p>
      <a href={notice.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-10 items-center border border-roxred bg-roxred px-4 text-xs font-bold uppercase tracking-rox text-bone">
        Abrir WhatsApp
      </a>
      <button
        type="button"
        onClick={() => {
          window.sessionStorage.removeItem(STORAGE_KEY);
          setNotice(null);
        }}
        className="ml-3 min-h-10 border border-bone/16 px-4 text-xs font-bold uppercase tracking-rox text-bone/70"
      >
        Cerrar
      </button>
    </div>
  );
}
