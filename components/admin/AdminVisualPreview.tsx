import { Eye } from "lucide-react";
import { getPublicMediaUrl } from "@/lib/media/publicUrl";
import type { HomeSection } from "@/types/admin";
import type { Product } from "@/types/product";

type ImagePathPreviewProps = {
  imagePath: string | null;
  title: string;
  fallbackBucket?: string;
  ratio?: "wide" | "poster";
};

export function ImagePathPreview({ imagePath, title, fallbackBucket = "site-images", ratio = "wide" }: ImagePathPreviewProps) {
  const imageUrl = getPublicMediaUrl(imagePath, fallbackBucket);

  if (!imageUrl) {
    return null;
  }

  return (
    <section className="grid gap-3 border border-bone/12 bg-ink/70 p-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
        <Eye size={14} />
        Vista previa
      </div>
      <div className={`overflow-hidden border border-bone/10 bg-charcoal ${ratio === "poster" ? "aspect-[4/5]" : "aspect-[16/9]"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <p className="break-all text-[10px] uppercase tracking-rox text-bone/42">{imagePath}</p>
    </section>
  );
}

export function RandomWheelAdminPreview({ section, products }: { section: HomeSection; products: Product[] }) {
  const previewProduct = products[0];

  if (!previewProduct) {
    return null;
  }

  return (
    <section className="grid gap-3 border border-roxgold/20 bg-ink/70 p-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
        <Eye size={14} />
        Vista previa ruleta
      </div>
      <div className="grid overflow-hidden border border-bone/10 bg-charcoal sm:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3 p-4">
          <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">{section.subtitle || "Random pick"}</p>
          <h3 className="headline text-3xl leading-none text-bone">{section.title || "RULETA DE PRINTS"}</h3>
          <p className="text-xs leading-5 text-bone/58">{section.body || "Deja que ROXWANA elija un modelo para arrancar el pedido."}</p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-rox text-bone/62">
            <span className="border border-bone/12 px-2 py-2 text-center">Hombre</span>
            <span className="border border-bone/12 px-2 py-2 text-center">Mujer</span>
          </div>
          <span className="inline-flex min-h-9 items-center justify-center border border-roxgold bg-roxgold px-3 text-[10px] font-bold uppercase tracking-rox text-charcoal">
            {section.ctaLabel || "Girar ruleta"}
          </span>
        </div>
        <div className="relative min-h-56 overflow-hidden bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewProduct.image} alt={previewProduct.name} className="h-full min-h-56 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-[10px] font-bold uppercase tracking-rox text-roxgold">{previewProduct.modelCode}</p>
            <p className="headline mt-1 text-2xl leading-none text-bone">{previewProduct.name}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeSectionVisualPreview({ section, products }: { section: HomeSection; products: Product[] }) {
  if (section.key === "final_cta") {
    return <RandomWheelAdminPreview section={section} products={products} />;
  }

  return <ImagePathPreview imagePath={section.imagePath} title={section.title || section.key} />;
}
