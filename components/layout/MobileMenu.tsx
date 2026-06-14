"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { RoxButton } from "@/components/ui/RoxButton";

const navItems = [
  { label: "Shop", href: "/productos" },
  { label: "Colecciones", href: "/hombre" },
  { label: "Lookbook", href: "/mujer" },
  { label: "Nosotros", href: "/#ordenar" }
];

export function MobileMenu({ isOpen, onClose, cartCount }: { isOpen: boolean; onClose: () => void; cartCount: number }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink md:hidden">
      <div className="flex h-20 items-center justify-between px-5">
        <Link href="/" onClick={onClose} className="flex items-center gap-3">
          <Image
            src="/brand/roxwana-logo-128.webp"
            alt="ROXWANA"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full border border-roxgold/45 bg-bone object-contain shadow-gold-soft"
            priority
          />
          <span className="headline text-3xl text-bone">ROXWANA</span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center border border-bone/20 text-bone"
          aria-label="Cerrar menu"
        >
          <X size={20} />
        </button>
      </div>
      <nav className="px-5 pt-10">
        <div className="space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="headline block border-b border-bone/12 py-5 text-4xl text-bone"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <RoxButton href="/productos" variant="bone" className="mt-10 w-full" onClick={onClose}>
          Ver coleccion
        </RoxButton>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <RoxButton href="/login" variant="ghost" className="w-full" onClick={onClose}>
            Cuenta
          </RoxButton>
          <RoxButton href="/carrito" variant="ghost" className="w-full" onClick={onClose}>
            Carrito
            {cartCount > 0 ? (
              <span className="ml-2 inline-grid min-h-5 min-w-5 place-items-center bg-roxred px-1 text-[10px] font-black leading-none text-bone">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </RoxButton>
        </div>
        <div className="mt-4">
          <ThemeToggle compact />
        </div>
      </nav>
    </div>
  );
}
