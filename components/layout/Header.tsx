"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingCart, User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Todos los modelos", href: "/productos" },
  { label: "Ruleta", href: "/random" },
  { label: "Nosotros", href: "/nosotros" }
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  const refreshCartCount = useCallback(async () => {
    try {
      const response = await fetch("/api/cart/count", {
        cache: "no-store"
      });
      const result = (await response.json()) as { count?: number };
      setCartCount(Math.max(0, Number(result.count) || 0));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(refreshCartCount, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, refreshCartCount]);

  useEffect(() => {
    const syncCartCount = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number }>).detail;

      if (typeof detail?.count === "number") {
        setCartCount(Math.max(0, detail.count));
        return;
      }

      refreshCartCount();
    };

    window.addEventListener("roxwana-cart-updated", syncCartCount);
    window.addEventListener("roxwana-cart-count", syncCartCount);
    window.addEventListener("focus", refreshCartCount);

    return () => {
      window.removeEventListener("roxwana-cart-updated", syncCartCount);
      window.removeEventListener("roxwana-cart-count", syncCartCount);
      window.removeEventListener("focus", refreshCartCount);
    };
  }, [refreshCartCount]);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-ink/35 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-[min(1220px,calc(100vw-28px))] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/roxwana-logo-128.webp"
              alt="ROXWANA"
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-full border border-roxgold/45 bg-bone object-contain shadow-gold-soft"
              priority
            />
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
              { label: "Carrito", icon: ShoppingCart, href: "/carrito", count: cartCount }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="relative grid h-10 w-10 place-items-center border border-bone/12 text-bone/78 transition hover:border-roxgold hover:text-bone"
                  aria-label={item.count ? `${item.label}: ${item.count} productos` : item.label}
                  title={item.label}
                >
                  <Icon size={18} />
                  {item.count ? (
                    <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center border border-ink bg-roxred px-1 text-[10px] font-black leading-none text-bone">
                      {item.count > 99 ? "99+" : item.count}
                    </span>
                  ) : null}
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
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} cartCount={cartCount} />
    </>
  );
}
