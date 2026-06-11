"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { buildSku } from "@/lib/products/buildSku";
import { addToCartAction } from "@/lib/cart/actions";

export function ProductSelector({ product }: { product: Product; settings: SiteSettings }) {
  const router = useRouter();
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const sku = useMemo(() => (color && size ? buildSku(product, color, size) : null), [color, product, size]);
  const canAdd = Boolean(color && size && product.id);

  const addToCart = () => {
    if (!canAdd || !product.id) {
      setMessage("Selecciona color y talle antes de agregar al carrito.");
      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id || "",
        selectedColor: color,
        selectedSize: size,
        quantity
      });

      if (!result.ok) {
        if (result.needsLogin) {
          router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
          return;
        }

        setMessage(result.error || "No se pudo agregar al carrito.");
        return;
      }

      setMessage("Producto agregado. Tu carrito quedo guardado.");
      window.dispatchEvent(new CustomEvent("roxwana-cart-updated"));
      router.refresh();
    });
  };

  return (
    <div className="mt-8">
      <div className="border-y border-bone/12 py-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-rox text-steel">Color</p>
        <div className="flex flex-wrap gap-3">
          {product.colors.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setColor(item.code)}
              className={`flex items-center gap-3 border px-4 py-3 text-xs font-bold uppercase tracking-rox transition ${
                color === item.code ? "border-roxgold text-bone" : "border-bone/12 text-bone/58 hover:border-bone/40"
              }`}
            >
              <span className="h-4 w-4 border border-bone/24" style={{ backgroundColor: item.hex || "#111111" }} />
              {item.label}
            </button>
          ))}
        </div>

        <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-rox text-steel">Talle</p>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSize(item)}
              className={`h-11 min-w-12 border px-4 text-sm font-bold transition ${
                size === item ? "border-roxgold bg-roxgold text-charcoal" : "border-bone/12 text-bone/70 hover:border-roxgold/70"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mb-3 mt-6 text-xs font-bold uppercase tracking-rox text-steel">Cantidad</p>
        <div className="inline-flex border border-bone/12">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-11 w-11 text-bone">
            -
          </button>
          <span className="grid h-11 min-w-12 place-items-center border-x border-bone/12 text-sm font-bold text-bone">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="h-11 w-11 text-bone">
            +
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 border border-bone/12 bg-charcoal p-5">
        <p className="text-xs font-bold uppercase tracking-rox text-steel">SKU seleccionado</p>
        <p className="headline text-3xl text-bone">{sku || "Selecciona color y talle"}</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start">
        <button
          type="button"
          onClick={addToCart}
          disabled={!canAdd || isPending}
          className="min-h-11 border border-roxgold bg-roxgold px-5 py-3 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:cursor-not-allowed disabled:border-bone/20 disabled:bg-bone/20 disabled:text-bone/40"
        >
          {isPending ? "Agregando..." : "Agregar al carrito"}
        </button>
        <a href="/carrito" className="inline-flex min-h-11 items-center justify-center border border-bone/45 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Ver carrito
        </a>
      </div>

      {message ? <p className="mt-4 border border-roxgold/30 bg-roxgold/10 p-4 text-sm leading-6 text-bone/78">{message}</p> : null}
    </div>
  );
}
