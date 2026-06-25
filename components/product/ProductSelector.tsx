"use client";

import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState, useTransition } from "react";
import type { Product } from "@/types/product";
import type { SiteSettings } from "@/types/settings";
import { addToCartAction } from "@/lib/cart/actions";
import { ColorSwatch } from "@/components/product/ColorSwatch";

export function ProductSelector({
  product,
  selectedColor = "",
  onColorChange
}: {
  product: Product;
  settings: SiteSettings;
  selectedColor?: string;
  onColorChange?: (color: string) => void;
}) {
  const router = useRouter();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canAdd = Boolean(selectedColor && size && product.id);

  const addToCart = () => {
    if (!canAdd || !product.id) {
      setMessage("Selecciona color y talle antes de agregar al carrito.");
      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id || "",
        selectedColor,
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

      setMessage(null);
      window.dispatchEvent(new CustomEvent("roxwana-cart-updated"));
      router.refresh();
    });
  };

  return (
    <div className="mt-4">
      <div className="grid gap-3 border-y border-bone/12 py-3">
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((item) => (
              <ColorSwatch
                key={item.code}
                color={item}
                selected={selectedColor === item.code}
                size="md"
                onClick={() => onColorChange?.(item.code)}
                dataProductColor={item.code}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Talle</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSize(item)}
                className={`h-8 min-w-9 border px-2.5 text-xs font-bold transition ${
                  size === item ? "border-roxgold bg-roxgold text-charcoal" : "border-bone/12 text-bone/70 hover:border-roxgold/70"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Cantidad</p>
          <div className="inline-flex w-fit border border-bone/12">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="grid h-8 w-8 place-items-center text-bone">
              <Minus size={14} />
            </button>
            <span className="grid h-8 min-w-9 place-items-center border-x border-bone/12 text-xs font-bold text-bone">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="grid h-8 w-8 place-items-center text-bone">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          onClick={addToCart}
          disabled={isPending}
          aria-disabled={!canAdd || isPending}
          className={`relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden border px-5 py-3 text-xs font-bold uppercase tracking-rox transition hover:border-bone disabled:cursor-not-allowed ${
            isPending
              ? "border-roxgold bg-charcoal text-bone"
              : canAdd
                ? "border-roxgold bg-roxgold text-charcoal"
                : "border-roxgold/45 bg-roxgold/10 text-bone/78"
          }`}
        >
          {isPending ? <span className="rox-loading-button-bar absolute inset-y-0 left-0 w-full bg-roxgold/45" aria-hidden="true" /> : null}
          <ShoppingCart size={16} className="relative z-10" />
          <span className="relative z-10">{isPending ? "Agregando..." : "Agregar al carrito"}</span>
        </button>
        <a href="/carrito" className="inline-flex min-h-10 items-center justify-center border border-bone/45 px-5 py-2.5 text-xs font-bold uppercase tracking-rox text-bone">
          Ver carrito
        </a>
      </div>

      {message ? <p className="mt-4 border border-roxgold/30 bg-roxgold/10 p-4 text-sm leading-6 text-bone/78">{message}</p> : null}
    </div>
  );
}
