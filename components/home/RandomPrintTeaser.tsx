"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shuffle, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition, type CSSProperties } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { addToCartAction } from "@/lib/cart/actions";
import type { Product } from "@/types/product";

type GenderChoice = "hombre" | "mujer";
type WheelPhase = "idle" | "spinning" | "slowing" | "winner";
type WinnerBags = Record<GenderChoice, string[]>;
type LastWinners = Record<GenderChoice, string | null>;

const GENDER_OPTIONS: { value: GenderChoice; label: string; description: string }[] = [
  { value: "hombre", label: "Hombre", description: "Remeras, drops y estampas masculinas." },
  { value: "mujer", label: "Mujer", description: "Prendas femeninas con la misma energia ROXWANA." }
];

const SPIN_DELAYS = [58, 58, 62, 62, 66, 70, 76, 84, 96, 112, 132, 154, 180, 212, 252, 302, 360];

const CONFETTI_PIECES = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: 8 + ((index * 13) % 84),
  delay: (index % 6) * 42,
  x: index % 2 === 0 ? 40 + index * 3 : -42 - index * 2,
  y: 86 + (index % 5) * 24,
  rotate: index % 2 === 0 ? 220 + index * 8 : -210 - index * 7,
  color: index % 3 === 0 ? "#c8a46a" : index % 3 === 1 ? "#b11226" : "#f6f3ee"
}));

function getProductKey(product: Product) {
  return product.id || product.slug || product.modelCode;
}

function getProductsForGender(products: Product[], gender: GenderChoice | null) {
  if (!gender) {
    return products;
  }

  return products.filter((product) => product.gender === gender || product.gender === "unisex");
}

function pickWinner(products: Product[], currentBag: string[], lastWinner: string | null) {
  const availableKeys = products.map(getProductKey);
  let nextBag = currentBag.filter((key) => availableKeys.includes(key));

  if (nextBag.length === 0) {
    nextBag = availableKeys.filter((key) => availableKeys.length === 1 || key !== lastWinner);
  }

  if (nextBag.length === 0) {
    nextBag = availableKeys;
  }

  const winnerKey = nextBag[Math.floor(Math.random() * nextBag.length)];
  const winner = products.find((product) => getProductKey(product) === winnerKey) || null;
  const remainingBag = nextBag.filter((key) => key !== winnerKey);

  return { winner, remainingBag };
}

export function RandomPrintTeaser({ compact = false, products }: { compact?: boolean; products: Product[] }) {
  const [selectedGender, setSelectedGender] = useState<GenderChoice | null>(null);
  const [phase, setPhase] = useState<WheelPhase>("idle");
  const [index, setIndex] = useState(0);
  const [winner, setWinner] = useState<Product | null>(null);
  const [bags, setBags] = useState<WinnerBags>({ hombre: [], mujer: [] });
  const [lastWinners, setLastWinners] = useState<LastWinners>({ hombre: null, mujer: null });
  const [showPrizeBurst, setShowPrizeBurst] = useState(false);
  const [hint, setHint] = useState("Elegi una categoria para activar la ruleta.");
  const timersRef = useRef<number[]>([]);

  const wheelLocked = phase === "spinning" || phase === "slowing";
  const filteredProducts = useMemo(() => getProductsForGender(products, selectedGender), [products, selectedGender]);
  const previewProducts = selectedGender ? filteredProducts : products;
  const displayProduct = winner || previewProducts[index % Math.max(previewProducts.length, 1)] || products[0];
  const hasCategoryProducts = Boolean(selectedGender && filteredProducts.length > 0);

  const clearSpinTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => clearSpinTimers, []);

  const selectGender = (gender: GenderChoice) => {
    if (wheelLocked) {
      return;
    }

    clearSpinTimers();
    setSelectedGender(gender);
    setIndex(0);
    setWinner(null);
    setShowPrizeBurst(false);
    setPhase("idle");
    setHint("Listo. Toca girar y deja que la ruleta elija.");
  };

  const startSpin = () => {
    if (!selectedGender) {
      setHint("Primero elegi Hombre o Mujer.");
      return;
    }

    if (filteredProducts.length === 0) {
      setHint("No hay prendas cargadas para esta categoria.");
      return;
    }

    if (wheelLocked) {
      return;
    }

    clearSpinTimers();
    const result = pickWinner(filteredProducts, bags[selectedGender], lastWinners[selectedGender]);

    if (!result.winner) {
      setHint("No hay prendas cargadas para esta categoria.");
      return;
    }

    const targetIndex = filteredProducts.findIndex((product) => getProductKey(product) === getProductKey(result.winner!));
    let elapsed = 0;

    setWinner(null);
    setShowPrizeBurst(false);
    setPhase("spinning");
    setHint("La ruleta esta corriendo...");

    SPIN_DELAYS.forEach((delay, step) => {
      elapsed += delay;
      const timer = window.setTimeout(() => {
        const isLastStep = step === SPIN_DELAYS.length - 1;

        if (step > SPIN_DELAYS.length * 0.55) {
          setPhase("slowing");
        }

        if (isLastStep) {
          setIndex(Math.max(targetIndex, 0));
          setWinner(result.winner);
          setBags((value) => ({ ...value, [selectedGender]: result.remainingBag }));
          setLastWinners((value) => ({ ...value, [selectedGender]: getProductKey(result.winner!) }));
          setPhase("winner");
          setShowPrizeBurst(true);
          setHint("El sistema eligio esta estampa. Elegi talle y color para llevarla al carrito.");
          return;
        }

        setIndex((value) => (value + 1) % filteredProducts.length);
      }, elapsed);

      timersRef.current.push(timer);
    });
  };

  if (products.length === 0) {
    return (
      <section className={`theme-shop bg-ink ${compact ? "py-8" : "py-20"}`}>
        <div className="rox-container">
          <div className="border border-roxgold/24 bg-charcoal p-8 text-center">
            <p className="headline text-4xl text-bone">NO HAY PRENDAS CARGADAS</p>
            <p className="mt-3 text-sm uppercase tracking-rox text-bone/58">La ruleta esta en preparacion.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`theme-shop bg-ink ${compact ? "py-8" : "py-20"}`}>
      <div className="rox-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div>
          <SectionHeader
            eyebrow="Random print"
            title="RULETA ROXWANA"
            description="Elegi categoria, gira la ruleta y deja que el sistema elija una estampa para llevar al carrito."
          />

          <div className="mt-8 grid gap-3">
            <p className="text-xs font-bold uppercase tracking-rox text-steel">Categoria</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {GENDER_OPTIONS.map((option) => {
                const selected = selectedGender === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    data-random-gender={option.value}
                    disabled={wheelLocked}
                    onClick={() => selectGender(option.value)}
                    className={`min-h-[112px] border p-4 text-left transition disabled:cursor-not-allowed ${
                      selected ? "border-roxgold bg-roxgold/10 text-bone" : "border-bone/12 bg-charcoal text-bone/64 hover:border-bone/40"
                    }`}
                  >
                    <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-rox">
                      <span className={`grid h-5 w-5 place-items-center border ${selected ? "border-roxgold" : "border-bone/24"}`}>
                        {selected ? <span className="h-2.5 w-2.5 bg-roxgold" /> : null}
                      </span>
                      {option.label}
                    </span>
                    <span className="mt-3 block text-sm leading-6 text-bone/62">{option.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            data-random-spin
            onClick={startSpin}
            disabled={wheelLocked || !selectedGender || !hasCategoryProducts}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 border border-roxred bg-roxred px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone transition hover:bg-roxred/82 disabled:cursor-not-allowed disabled:border-bone/16 disabled:bg-bone/10 disabled:text-bone/38"
          >
            <Shuffle size={18} />
            {wheelLocked ? "Girando..." : phase === "winner" ? "Girar de nuevo" : "Girar ruleta"}
          </button>

          <p className="mt-4 min-h-12 border border-bone/12 bg-charcoal/80 p-4 text-sm leading-6 text-bone/68">{hint}</p>
        </div>

        <div className={`overflow-hidden border border-roxgold/24 bg-charcoal shadow-hard-red ${phase === "winner" ? "random-print-selection-pop" : ""}`}>
          <div className="relative min-h-[460px]">
            {displayProduct ? (
              <Image
                key={`${getProductKey(displayProduct)}-${phase}`}
                src={displayProduct.image}
                alt={displayProduct.name}
                fill
                priority={compact}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className={`object-cover transition duration-300 ${wheelLocked ? "scale-105 blur-[1px]" : "scale-100 blur-0"}`}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />

            {showPrizeBurst ? (
              <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                {CONFETTI_PIECES.map((piece) => (
                  <span
                    key={piece.id}
                    className="random-print-confetti-piece absolute top-8 h-3 w-2"
                    style={
                      {
                        left: `${piece.left}%`,
                        backgroundColor: piece.color,
                        animationDelay: `${piece.delay}ms`,
                        "--confetti-x": `${piece.x}px`,
                        "--confetti-y": `${piece.y}px`,
                        "--confetti-rotate": `${piece.rotate}deg`
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            ) : null}

            <div className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 border border-roxgold/45 bg-ink/72 px-3 py-2 text-xs font-bold uppercase tracking-rox text-roxgold backdrop-blur">
              <Sparkles size={16} />
              {phase === "winner" ? "Estampa seleccionada" : wheelLocked ? "Eligiendo estampa" : "Ruleta lista"}
            </div>

            <div className="absolute bottom-5 left-5 right-5 z-20">
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{displayProduct?.modelCode || "ROXWANA"}</p>
              <h3 className="headline mt-2 text-4xl leading-none text-bone md:text-5xl">{displayProduct?.name || "Random print"}</h3>
            </div>
          </div>

          <PrizePanel
            key={winner ? getProductKey(winner) : `${selectedGender || "none"}-${phase}`}
            product={winner}
            phase={phase}
            hasCategoryProducts={hasCategoryProducts}
            selectedGender={selectedGender}
          />
        </div>
      </div>
    </section>
  );
}

function PrizePanel({
  product,
  phase,
  hasCategoryProducts,
  selectedGender
}: {
  product: Product | null;
  phase: WheelPhase;
  hasCategoryProducts: boolean;
  selectedGender: GenderChoice | null;
}) {
  const router = useRouter();
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!selectedGender) {
    return (
      <div className="border-t border-bone/12 bg-charcoal/96 p-5">
        <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Primero elegi categoria</p>
        <p className="mt-2 text-sm leading-6 text-bone/66">Marca Hombre o Mujer para activar la ruleta.</p>
      </div>
    );
  }

  if (!hasCategoryProducts) {
    return (
      <div className="border-t border-bone/12 bg-charcoal/96 p-5">
        <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Sin prendas</p>
        <p className="mt-2 text-sm leading-6 text-bone/66">No hay prendas cargadas para esta categoria.</p>
      </div>
    );
  }

  if (!product || phase !== "winner") {
    return (
      <div className="border-t border-bone/12 bg-charcoal/96 p-5">
        <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{phase === "slowing" ? "Casi esta" : "Seleccion pendiente"}</p>
        <p className="mt-2 text-sm leading-6 text-bone/66">Cuando la ruleta frene, aparecen color, talle y carrito dentro de esta misma ventana.</p>
      </div>
    );
  }

  const canAdd = Boolean(color && size && product.id);

  const addPrizeToCart = () => {
    if (!canAdd || !product.id) {
      setMessage("Elegi color y talle antes de agregar al carrito.");
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

      setMessage("Producto agregado al carrito.");
      router.refresh();
    });
  };

  return (
    <div className="border-t border-roxgold/24 bg-charcoal/96 p-5">
      <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr] xl:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Estampa seleccionada</p>
          <p className="headline mt-2 text-3xl leading-none text-bone">{product.model}</p>
          <p className="mt-3 text-sm leading-6 text-bone/66">{product.story}</p>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-rox text-steel">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    data-prize-color={item.code}
                    onClick={() => setColor(item.code)}
                    className={`flex min-h-10 items-center gap-2 border px-3 py-2 text-xs font-bold uppercase tracking-rox transition ${
                      color === item.code ? "border-roxgold text-bone" : "border-bone/12 text-bone/58 hover:border-bone/40"
                    }`}
                  >
                    <span className="h-3.5 w-3.5 border border-bone/24" style={{ backgroundColor: item.hex || "#111111" }} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-rox text-steel">Talle</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    data-prize-size={item}
                    onClick={() => setSize(item)}
                    className={`h-10 min-w-11 border px-3 text-sm font-bold transition ${
                      size === item ? "border-roxred bg-roxred text-bone" : "border-bone/12 text-bone/70 hover:border-bone/40"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-rox text-steel">Cantidad</p>
              <div className="inline-flex border border-bone/12">
                <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-10 w-10 text-bone">
                  -
                </button>
                <span className="grid h-10 min-w-11 place-items-center border-x border-bone/12 text-sm font-bold text-bone">{quantity}</span>
                <button type="button" onClick={() => setQuantity((value) => Math.min(20, value + 1))} className="h-10 w-10 text-bone">
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              data-prize-add
              onClick={addPrizeToCart}
              disabled={!canAdd || isPending}
              className="min-h-10 border border-bone bg-bone px-4 py-2 text-xs font-bold uppercase tracking-rox text-charcoal transition disabled:cursor-not-allowed disabled:border-bone/20 disabled:bg-bone/20 disabled:text-bone/40"
            >
              {isPending ? "Agregando..." : "Agregar al carrito"}
            </button>
            <a href="/carrito" className="inline-flex min-h-10 items-center justify-center border border-bone/45 px-4 py-2 text-xs font-bold uppercase tracking-rox text-bone">
              Ver carrito
            </a>
          </div>

          {message ? <p className="border border-roxgold/30 bg-roxgold/10 p-3 text-sm leading-6 text-bone/78">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
