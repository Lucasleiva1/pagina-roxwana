"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { label: "Shop", href: "/productos" },
  { label: "Colecciones", href: "/hombre" },
  { label: "Lookbook", href: "/mujer" },
  { label: "Nosotros", href: "/#ordenar" }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-ink/35 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-[min(1220px,calc(100vw-28px))] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center border border-roxgold/50 bg-charcoal text-lg font-black text-bone shadow-gold-soft">
              RW
            </span>
            <span className="headline text-2xl text-bone">ROXWANA</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold uppercase tracking-rox text-bone/72 transition hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {[
              { label: "Buscar", icon: Search, href: "/productos" },
              { label: "Usuario", icon: User, href: "/login" },
              { label: "Bolsa", icon: ShoppingBag, href: "/carrito" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="grid h-10 w-10 place-items-center border border-bone/12 text-bone/78 transition hover:border-roxgold hover:text-bone"
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={18} />
                </Link>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="grid h-11 w-11 place-items-center border border-bone/20 text-bone md:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
