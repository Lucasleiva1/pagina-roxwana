"use client";

import Link from "next/link";
import {
  CircleUserRound,
  Dices,
  House,
  Info,
  ListOrdered,
  Share2,
  Shirt,
  X,
  type LucideIcon
} from "lucide-react";
import { useEffect } from "react";
import { ThemeLogoControl } from "@/components/layout/ThemeLogoControl";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

const navItems: NavItem[] = [
  { label: "Inicio", href: "/", icon: House },
  {
    label: "Producto",
    href: "/productos",
    icon: Shirt,
    children: [
      { label: "Hombre", href: "/productos?gender=hombre" },
      { label: "Mujer", href: "/productos?gender=mujer" }
    ]
  },
  { label: "Ordenar", href: "/#ordenar", icon: ListOrdered },
  { label: "Redes", href: "/#redes", icon: Share2 },
  { label: "Ruleta", href: "/random", icon: Dices },
  { label: "Nosotros", href: "/nosotros", icon: Info }
];

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => window.scrollTo(0, scrollY));
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="mobile-menu-panel fixed inset-0 z-50 flex flex-col overflow-hidden bg-ink md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
    >
      <div className="mobile-menu-header flex h-20 shrink-0 items-center justify-between border-b border-bone/12 px-5">
        <div className="flex items-center gap-3">
          <ThemeLogoControl size={48} onNavigate={onClose} />
          <Link href="/" onClick={onClose} aria-label="Ir al inicio">
            <span className="headline text-2xl text-bone">ROXWANA</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="header-menu-button grid h-11 w-11 place-items-center rounded-md border border-bone/20 text-bone"
          aria-label="Cerrar menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mobile-menu-scroll min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <nav aria-label="Navegacion movil">
          <div className="overflow-hidden rounded-md border border-bone/12">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.href} className="border-b border-bone/12 last:border-b-0">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="mobile-menu-link flex min-h-12 items-center gap-3 px-4 py-3 text-sm font-black uppercase tracking-rox text-bone transition hover:bg-roxgold/10 hover:text-roxgold"
                  >
                    <Icon className="h-[18px] w-[18px] shrink-0 text-roxgold" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                  {item.children ? (
                    <div className="grid grid-cols-2 gap-2 border-t border-bone/12 bg-bone/[0.035] p-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="flex min-h-10 items-center justify-center rounded-md border border-roxgold/35 px-3 py-2 text-[11px] font-black uppercase tracking-rox text-roxgold transition hover:bg-roxgold hover:text-charcoal"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </nav>

        <div className="mt-5">
          <Link
            href="/login"
            onClick={onClose}
            className="mobile-menu-action flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-bone/20 px-3 text-xs font-black uppercase tracking-rox text-bone transition hover:border-roxgold"
          >
            <CircleUserRound size={17} className="text-roxgold" aria-hidden="true" />
            Cuenta
          </Link>
        </div>

      </div>
    </div>
  );
}
