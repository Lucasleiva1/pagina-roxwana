"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Minus, Plus, Search, ShoppingCart, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeLogoControl } from "@/components/layout/ThemeLogoControl";

type NavItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

const navItems: NavItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Producto",
    href: "/productos",
    children: [
      { label: "Hombre", href: "/productos?gender=hombre" },
      { label: "Mujer", href: "/productos?gender=mujer" }
    ]
  },
  { label: "Ordenar", href: "/#ordenar" },
  { label: "Redes", href: "/#redes" },
  { label: "Ruleta", href: "/random" },
  { label: "Nosotros", href: "/nosotros" }
];

type CartPreviewItem = {
  id: string;
  productName: string;
  modelCode: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  priceSnapshot: number | null;
  imageUrl: string | null;
};

type CartPreview = {
  count: number;
  total: number;
  items: CartPreviewItem[];
};

function formatHeaderPrice(price: number | null | undefined) {
  if (!price) {
    return "Sin precio";
  }

  return `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)}`;
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartReacting, setCartReacting] = useState(false);
  const [cartPreview, setCartPreview] = useState<CartPreview>({ count: 0, total: 0, items: [] });
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [cartPreviewLoading, setCartPreviewLoading] = useState(false);
  const [cartMutating, setCartMutating] = useState(false);
  const [cartToastItem, setCartToastItem] = useState<CartPreviewItem | null>(null);
  const cartAudioRef = useRef<HTMLAudioElement | null>(null);
  const cartReactionTimeoutRef = useRef<number | null>(null);
  const cartToastTimeoutRef = useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

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

  const refreshCartPreview = useCallback(async ({ showToast = false }: { showToast?: boolean } = {}) => {
    setCartPreviewLoading(true);

    try {
      const response = await fetch("/api/cart/preview", {
        cache: "no-store"
      });
      const result = (await response.json()) as Partial<CartPreview>;
      const nextPreview = {
        count: Math.max(0, Number(result.count) || 0),
        total: Math.max(0, Number(result.total) || 0),
        items: Array.isArray(result.items) ? result.items : []
      };

      setCartCount(nextPreview.count);
      setCartPreview(nextPreview);

      if (showToast && nextPreview.items[0]) {
        setCartToastItem(nextPreview.items[0]);

        if (cartToastTimeoutRef.current) {
          window.clearTimeout(cartToastTimeoutRef.current);
        }

        cartToastTimeoutRef.current = window.setTimeout(() => setCartToastItem(null), 2800);
      }
    } catch {
      if (showToast) {
        setCartToastItem(null);
      }
    } finally {
      setCartPreviewLoading(false);
    }
  }, []);

  const triggerCartReaction = useCallback(() => {
    const audio = cartAudioRef.current;

    if (audio) {
      audio.currentTime = 0;
      audio.volume = 0.46;
      void audio.play().catch(() => {});
    }

    if (cartReactionTimeoutRef.current) {
      window.clearTimeout(cartReactionTimeoutRef.current);
    }

    setCartReacting(false);
    window.requestAnimationFrame(() => {
      setCartReacting(true);
      cartReactionTimeoutRef.current = window.setTimeout(() => setCartReacting(false), 720);
    });
  }, []);

  const mutateCartPreview = useCallback(
    async (request: () => Promise<Response>) => {
      setCartMutating(true);

      try {
        const response = await request();

        if (response.ok) {
          await refreshCartPreview();
          router.refresh();
        }
      } finally {
        setCartMutating(false);
      }
    },
    [refreshCartPreview, router]
  );

  const updatePreviewItemQuantity = useCallback(
    (item: CartPreviewItem, quantity: number) => {
      void mutateCartPreview(() =>
        fetch(`/api/cart/items/${item.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ quantity })
        })
      );
    },
    [mutateCartPreview]
  );

  const removePreviewItem = useCallback(
    (item: CartPreviewItem) => {
      void mutateCartPreview(() =>
        fetch(`/api/cart/items/${item.id}`, {
          method: "DELETE"
        })
      );
    },
    [mutateCartPreview]
  );

  const clearPreviewCart = useCallback(() => {
    void mutateCartPreview(() =>
      fetch("/api/cart/clear", {
        method: "DELETE"
      })
    );
  }, [mutateCartPreview]);

  useEffect(() => {
    const timer = window.setTimeout(refreshCartCount, 0);

    return () => window.clearTimeout(timer);
  }, [pathname, refreshCartCount]);

  useEffect(() => {
    const syncCartCount = (event: Event) => {
      const detail = (event as CustomEvent<{ count?: number }>).detail;

      if (event.type === "roxwana-cart-updated") {
        triggerCartReaction();
        void refreshCartPreview({ showToast: true });
        return;
      }

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
  }, [refreshCartCount, refreshCartPreview, triggerCartReaction]);

  useEffect(() => {
    return () => {
      if (cartReactionTimeoutRef.current) {
        window.clearTimeout(cartReactionTimeoutRef.current);
      }

      if (cartToastTimeoutRef.current) {
        window.clearTimeout(cartToastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-bone/10 bg-ink/35 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-[min(1220px,calc(100vw-28px))] items-center justify-between">
          <div className="flex items-center gap-3">
            <ThemeLogoControl />
            <Link href="/" aria-label="Ir al inicio">
              <span className="headline text-2xl text-bone">ROXWANA</span>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.href} className="group/nav relative transition duration-300 hover:-translate-y-0.5 focus-within:-translate-y-0.5">
                  <Link href={item.href} className="relative block py-2 text-xs font-bold uppercase tracking-rox text-bone/72 transition duration-300 group-hover/nav:text-roxgold group-focus-within/nav:text-roxgold">
                    {item.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-roxgold transition-transform duration-300 group-hover/nav:scale-x-100 group-focus-within/nav:scale-x-100" />
                  </Link>
                  <div className="pointer-events-none absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-focus-within/nav:pointer-events-auto group-focus-within/nav:opacity-100">
                    <div className="nav-dropdown-panel border border-roxgold/30 bg-[#050505] p-2 shadow-[0_18px_50px_rgba(0,0,0,0.56)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="nav-dropdown-link block border-b border-bone/10 px-3 py-3 text-xs font-black uppercase tracking-rox text-bone/72 transition last:border-b-0 hover:bg-roxgold hover:text-charcoal"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative py-2 text-xs font-bold uppercase tracking-rox text-bone/72 transition duration-300 hover:-translate-y-0.5 hover:text-roxgold"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 bg-roxgold transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              )
            )}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {[
              { label: "Buscar", icon: Search, href: "/productos" },
              { label: "Usuario", icon: User, href: "/login" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="header-tool-button relative grid h-10 w-10 place-items-center rounded-md border border-bone/12 text-bone/78 transition hover:border-roxgold hover:text-bone"
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={18} />
                </Link>
              );
            })}
            <div
              className="relative"
              onMouseEnter={() => {
                setCartPreviewOpen(true);
                void refreshCartPreview();
              }}
              onMouseLeave={() => setCartPreviewOpen(false)}
              onFocus={() => {
                setCartPreviewOpen(true);
                void refreshCartPreview();
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setCartPreviewOpen(false);
                }
              }}
            >
              <Link
                href="/carrito"
                className={`header-tool-button relative grid h-10 w-10 place-items-center rounded-md border border-bone/12 text-bone/78 transition hover:border-roxgold hover:text-bone ${
                  cartReacting ? "rox-cart-add-react" : ""
                }`}
                aria-label={cartCount ? `Carrito: ${cartCount} productos` : "Carrito"}
                title="Carrito"
              >
                <ShoppingCart size={18} />
                {cartCount ? (
                  <span className="cart-count-badge absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center border border-ink bg-roxred px-1 text-[10px] font-black leading-none text-bone">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Link>

              {cartPreviewOpen ? (
                <div className="absolute right-0 top-full z-50 w-80 pt-3">
                  <div className="cart-preview-panel border border-roxgold/30 bg-[#050505] p-4 text-left shadow-[0_24px_70px_rgba(0,0,0,0.68)]">
                    <div className="flex items-start justify-between gap-4 border-b border-bone/10 pb-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">Carrito</p>
                        <p className="mt-1 text-sm font-black uppercase tracking-rox text-bone">
                          {cartCount ? `${cartCount} ${cartCount === 1 ? "producto" : "productos"}` : "Sin productos"}
                        </p>
                      </div>
                      <p className="text-xs font-black uppercase tracking-rox text-bone/80">{formatHeaderPrice(cartPreview.total)}</p>
                    </div>

                    <div className="mt-3 grid max-h-[22rem] gap-3 overflow-y-auto pr-1">
                      {cartPreviewLoading && cartPreview.items.length === 0 ? (
                        <p className="py-5 text-sm text-bone/58">Cargando carrito...</p>
                      ) : cartPreview.items.length > 0 ? (
                        cartPreview.items.map((item) => (
                          <div key={item.id} className="grid grid-cols-[52px_1fr] gap-3 border-b border-bone/10 pb-3 last:border-b-0 last:pb-0">
                            <div className="h-14 w-14 overflow-hidden border border-bone/10 bg-charcoal">
                              {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={item.productName} width={56} height={56} className="h-full w-full object-cover" />
                              ) : (
                                <div className="grid h-full w-full place-items-center text-[10px] font-black text-roxgold">RXW</div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-black uppercase tracking-rox text-bone">{item.productName}</p>
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-rox text-bone/50">
                                {item.modelCode} / {item.selectedColor} / {item.selectedSize}
                              </p>
                              <p className="mt-1 text-xs font-bold text-bone/72">{formatHeaderPrice(item.priceSnapshot)}</p>
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <div className="inline-flex border border-bone/14">
                                  <button
                                    type="button"
                                    onClick={() => updatePreviewItemQuantity(item, Math.max(1, item.quantity - 1))}
                                    disabled={cartMutating || item.quantity <= 1}
                                    className="grid h-7 w-7 place-items-center text-bone/72 transition hover:bg-roxgold hover:text-charcoal disabled:cursor-not-allowed disabled:text-bone/25"
                                    aria-label={`Restar ${item.productName}`}
                                  >
                                    <Minus size={12} />
                                  </button>
                                  <span className="grid h-7 min-w-8 place-items-center border-x border-bone/14 text-xs font-black text-bone">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => updatePreviewItemQuantity(item, item.quantity + 1)}
                                    disabled={cartMutating || item.quantity >= 20}
                                    className="grid h-7 w-7 place-items-center text-bone/72 transition hover:bg-roxgold hover:text-charcoal disabled:cursor-not-allowed disabled:text-bone/25"
                                    aria-label={`Sumar ${item.productName}`}
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removePreviewItem(item)}
                                  disabled={cartMutating}
                                  className="inline-flex h-7 items-center gap-1 border border-roxgold/35 px-2 text-[10px] font-black uppercase tracking-rox text-roxgold transition hover:bg-roxgold hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-45"
                                >
                                  <Trash2 size={12} />
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-5 text-sm leading-6 text-bone/58">Todavia no agregaste prendas.</p>
                      )}
                    </div>

                    <div className="mt-4 grid gap-2">
                      <Link
                        href="/carrito"
                        className="inline-flex min-h-10 w-full items-center justify-center border border-roxgold bg-roxgold px-4 text-xs font-black uppercase tracking-rox text-charcoal transition hover:border-bone"
                      >
                        Ver carrito
                      </Link>
                      {cartPreview.items.length > 0 ? (
                        <button
                          type="button"
                          onClick={clearPreviewCart}
                          disabled={cartMutating}
                          className="cart-clear-action inline-flex min-h-9 w-full items-center justify-center border border-bone/16 px-4 text-[10px] font-black uppercase tracking-rox text-bone/72 transition hover:border-roxgold hover:text-roxgold disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          Limpiar todo
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {cartToastItem && !cartPreviewOpen ? (
                <div className="cart-toast-panel rox-cart-toast absolute right-0 top-[calc(100%+14px)] z-50 w-72 border border-roxgold/35 bg-[#050505] p-3 text-left shadow-[0_18px_55px_rgba(0,0,0,0.62)]">
                  <p className="text-[10px] font-black uppercase tracking-rox text-roxgold">Agregado al carrito</p>
                  <div className="mt-2 grid grid-cols-[46px_1fr] gap-3">
                    <div className="h-12 w-12 overflow-hidden border border-bone/10 bg-charcoal">
                      {cartToastItem.imageUrl ? (
                        <Image src={cartToastItem.imageUrl} alt={cartToastItem.productName} width={48} height={48} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] font-black text-roxgold">RXW</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-rox text-bone">{cartToastItem.productName}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-rox text-bone/52">
                        {cartToastItem.selectedColor} / {cartToastItem.selectedSize} / x{cartToastItem.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative" data-mobile-cart>
              <Link
                href="/carrito"
                className={`header-tool-button relative grid h-11 w-11 place-items-center rounded-md border border-bone/20 text-bone transition hover:border-roxgold ${
                  cartReacting ? "rox-cart-add-react" : ""
                }`}
                aria-label={cartCount ? `Carrito: ${cartCount} productos` : "Carrito"}
                title="Carrito"
              >
                <ShoppingCart size={20} />
                {cartCount ? (
                  <span className="cart-count-badge absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center border border-ink bg-roxred px-1 text-[10px] font-black leading-none text-bone">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Link>

              {cartToastItem ? (
                <div className="cart-toast-panel rox-cart-toast absolute right-0 top-[calc(100%+14px)] z-50 w-[min(18rem,calc(100vw-28px))] border border-roxgold/35 bg-[#050505] p-3 text-left shadow-[0_18px_55px_rgba(0,0,0,0.62)]">
                  <p className="text-[10px] font-black uppercase tracking-rox text-roxgold">Agregado al carrito</p>
                  <div className="mt-2 grid grid-cols-[46px_minmax(0,1fr)] gap-3">
                    <div className="h-12 w-12 overflow-hidden border border-bone/10 bg-charcoal">
                      {cartToastItem.imageUrl ? (
                        <Image src={cartToastItem.imageUrl} alt={cartToastItem.productName} width={48} height={48} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center text-[10px] font-black text-roxgold">RXW</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-black uppercase tracking-rox text-bone">{cartToastItem.productName}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-rox text-bone/52">
                        {cartToastItem.selectedColor} / {cartToastItem.selectedSize} / x{cartToastItem.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="header-menu-button grid h-11 w-11 place-items-center rounded-md border border-bone/20 text-bone"
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <audio ref={cartAudioRef} src="/audio/cart-add.mp3" preload="auto" aria-hidden="true" />
      <MobileMenu isOpen={menuOpen} onClose={closeMobileMenu} />
    </>
  );
}
