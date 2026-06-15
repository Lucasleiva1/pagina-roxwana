"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductImagePreview({ images }: { images: string[] }) {
  const gallery = useMemo(() => Array.from(new Set(images.filter(Boolean))), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex];
  const hasMultipleImages = gallery.length > 1;

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + gallery.length) % gallery.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % gallery.length);
  }

  return (
    <div className="relative overflow-hidden border border-bone/12 bg-ink">
      <div className="aspect-[4/5] bg-charcoal">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_top,_rgba(193,162,92,0.16),_transparent_38%),linear-gradient(145deg,_#171717,_#080808)]">
            <div className="text-center">
              <p className="headline text-4xl leading-none text-roxgold">RXW</p>
              <p className="mt-2 text-[9px] font-bold uppercase tracking-rox text-bone/42">Sin imagen</p>
            </div>
          </div>
        )}
      </div>

      {hasMultipleImages ? (
        <>
          <button
            type="button"
            aria-label="Ver imagen anterior"
            onClick={showPrevious}
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center border border-bone/18 bg-ink/78 text-bone transition hover:border-roxgold hover:text-roxgold"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Ver imagen siguiente"
            onClick={showNext}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center border border-bone/18 bg-ink/78 text-bone transition hover:border-roxgold hover:text-roxgold"
          >
            <ChevronRight size={16} />
          </button>
          <span className="absolute bottom-2 right-2 border border-roxgold/45 bg-ink/82 px-2 py-1 text-[10px] font-bold uppercase tracking-rox text-roxgold">
            {activeIndex + 1} / {gallery.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
