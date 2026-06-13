"use client";

import { Check, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { RoxButton } from "@/components/ui/RoxButton";
import { addToCartAction } from "@/lib/cart/actions";
import { getImageColorCode } from "@/lib/products/imageColors";
import type { Product } from "@/types/product";

function getDefaultColor(product: Product) {
  const imageColor = getImageColorCode(product.image);

  if (imageColor && product.colors.some((color) => color.code === imageColor)) {
    return imageColor;
  }

  return product.colors[0]?.code || "";
}

type ProductQuickActionsProps = {
  product: Product;
  viewVariant?: "bone" | "ghost" | "red";
  className?: string;
};

export function ProductQuickActions({ product, viewVariant = "bone", className = "" }: ProductQuickActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(() => getDefaultColor(product));
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canAdd = Boolean(product.id && selectedColor && selectedSize);

  const addToCart = () => {
    if (!product.id) {
      setMessage("Producto no disponible para carrito.");
      return;
    }

    if (!selectedColor || !selectedSize) {
      setMessage("Elegir talle para agregar.");
      return;
    }

    startTransition(async () => {
      const result = await addToCartAction({
        productId: product.id || "",
        selectedColor,
        selectedSize,
        quantity: 1
      });

      if (!result.ok) {
        if (result.needsLogin) {
          const returnUrl = `${window.location.pathname}${window.location.search}`;
          router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
          return;
        }

        setMessage(result.error || "No se pudo agregar al carrito.");
        return;
      }

      setMessage("Agregado al carrito.");
      window.dispatchEvent(new CustomEvent("roxwana-cart-updated"));
      router.refresh();
    });
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <RoxButton href={`/producto/${product.slug}`} variant={viewVariant} className="px-3">
          Ver modelo
        </RoxButton>
        <button
          type="button"
          onClick={() => {
            setOpen((value) => !value);
            setMessage(null);
          }}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-roxgold bg-roxgold px-3 py-3 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:cursor-not-allowed disabled:border-bone/20 disabled:bg-bone/20 disabled:text-bone/40"
          disabled={!product.id}
          aria-expanded={open}
          data-quick-add-toggle={product.modelCode}
        >
          <ShoppingCart size={16} />
          <span>Agregar</span>
        </button>
      </div>

      <div
        className={`absolute inset-x-0 bottom-0 z-30 p-3 transition duration-300 ease-out ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
        data-quick-add-panel={product.modelCode}
        aria-hidden={!open}
      >
        <div className="border border-roxgold/45 bg-[linear-gradient(180deg,rgba(15,15,15,0.96)_0%,rgba(5,5,5,0.99)_100%)] p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.72)] backdrop-blur-md">
          <div className="flex items-start justify-between gap-3 border-b border-bone/10 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">Agregar al carrito</p>
              <p className="mt-1 truncate text-sm font-bold uppercase tracking-rox text-bone">{product.name}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 shrink-0 place-items-center border border-bone/20 text-bone/70 transition hover:border-roxgold hover:text-roxgold"
              aria-label="Cerrar"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.code}
                    type="button"
                    onClick={() => setSelectedColor(color.code)}
                    className={`grid h-9 w-9 place-items-center border transition ${
                      selectedColor === color.code ? "border-roxgold bg-roxgold/10" : "border-bone/20 hover:border-bone/50"
                    }`}
                    aria-label={color.label}
                    title={color.label}
                  >
                    <span className="h-5 w-5 border border-bone/24" style={{ backgroundColor: color.hex || "#111111" }} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-rox text-steel">Talle</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-9 min-w-10 border px-2 text-xs font-bold transition ${
                      selectedSize === size ? "border-roxgold bg-roxgold text-charcoal" : "border-bone/20 text-bone/70 hover:border-roxgold/70"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={!canAdd || isPending}
            className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-roxgold bg-roxgold px-4 py-2 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:cursor-not-allowed disabled:border-bone/20 disabled:bg-bone/20 disabled:text-bone/40"
            data-quick-add-confirm={product.modelCode}
          >
            <Check size={15} />
            {isPending ? "Agregando..." : "Confirmar carrito"}
          </button>

          {message ? <p className="mt-3 border border-bone/12 bg-charcoal/80 px-3 py-2 text-xs leading-5 text-bone/72">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
