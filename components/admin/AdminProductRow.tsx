import Link from "next/link";
import { Copy, Edit3, Flame, MoreHorizontal, Star, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import { changeProductStatusAction, deleteProductAction, duplicateProductAction, toggleFeaturedProductAction } from "@/lib/products/mutations";
import { formatPrice } from "@/lib/products/formatPrice";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { ProductImagePreview } from "@/components/admin/ProductImagePreview";
import { StatusBadge } from "@/components/admin/StatusBadge";

function getProductImages(product: Product) {
  const sortedImages = [...(product.images || [])].sort((a, b) => a.sortOrder - b.sortOrder).map((image) => image.url);
  return [product.image, ...sortedImages].filter(Boolean);
}

function primaryStatusLabel(status: Product["status"]) {
  return status === "published" ? "Despublicar" : "Publicar";
}

function nextPrimaryStatus(status: Product["status"]) {
  return status === "published" ? "draft" : "published";
}

function actionButtonClass(tone: "primary" | "neutral" = "neutral") {
  return tone === "primary"
    ? "inline-flex min-h-9 items-center justify-center border border-roxgold bg-roxgold px-3 text-[10px] font-bold uppercase tracking-rox text-charcoal transition hover:border-bone"
    : "inline-flex min-h-9 items-center justify-center border border-bone/14 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold hover:text-roxgold";
}

function featuredButtonClass(featured: boolean) {
  const shared = "inline-flex min-h-9 w-full items-center justify-center border px-3 text-[10px] font-black uppercase tracking-rox transition";

  return featured
    ? `${shared} !border-roxgold !bg-roxgold !text-charcoal hover:!border-bone hover:!text-charcoal`
    : `${shared} !border-roxred !bg-roxred !text-bone hover:!border-bone hover:!text-bone`;
}

export function AdminProductRow({ product }: { product: Product }) {
  const productId = product.id;
  const productImages = getProductImages(product);

  return (
    <article className="group border border-bone/12 bg-charcoal shadow-gold-soft transition hover:border-roxgold/38">
      <div className="grid gap-0 md:grid-cols-[148px_minmax(0,1fr)] xl:grid-cols-[164px_minmax(0,1fr)]">
        <div className="relative border-b border-bone/10 md:border-b-0 md:border-r">
          <ProductImagePreview images={productImages} />
          {product.featured ? (
            <div className="absolute left-2 top-2 inline-flex items-center gap-1 border border-roxgold/50 bg-ink/82 px-2 py-1 text-[9px] font-bold uppercase tracking-rox text-roxgold">
              <Star size={12} fill="currentColor" /> Home
            </div>
          ) : null}
        </div>

        <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-rox text-roxgold">{product.modelCode}</p>
                <h3 className="mt-1 truncate text-lg font-black uppercase tracking-normal text-bone md:text-xl">{product.name}</h3>
              </div>
              <StatusBadge status={product.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-rox text-bone/50">
              <span className="border border-bone/10 px-2 py-1">{product.garmentLabel || product.garmentType}</span>
              <span className="border border-bone/10 px-2 py-1">{product.categoryLabel || "Sin categoria"}</span>
              {product.collectionLabel ? <span className="border border-bone/10 px-2 py-1">{product.collectionLabel}</span> : null}
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <p className="text-base font-black uppercase tracking-rox text-bone">{formatPrice(product.price)}</p>
              {product.compareAtPrice ? <p className="text-xs font-bold uppercase tracking-rox text-bone/38 line-through">{formatPrice(product.compareAtPrice)}</p> : null}
            </div>
          </div>

          <div className="grid content-between gap-3">
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/admin/productos/${productId}`} className={actionButtonClass("primary")}>
                Studio
              </Link>
              <Link href={`/admin/productos/${productId}`} className={actionButtonClass()}>
                <Edit3 size={13} className="mr-1.5" /> Editar
              </Link>
              {productId ? (
                <form action={changeProductStatusAction}>
                  <input type="hidden" name="id" value={productId} />
                  <input type="hidden" name="status" value={nextPrimaryStatus(product.status)} />
                  <button type="submit" className={`${actionButtonClass()} w-full`}>
                    {primaryStatusLabel(product.status)}
                  </button>
                </form>
              ) : null}
              {productId ? (
                <form action={toggleFeaturedProductAction}>
                  <input type="hidden" name="id" value={productId} />
                  <input type="hidden" name="featured" value={product.featured ? "false" : "true"} />
                  <button
                    type="submit"
                    aria-pressed={product.featured}
                    aria-label={product.featured ? `Quitar ${product.name} de destacados` : `Marcar ${product.name} como destacado`}
                    className={featuredButtonClass(product.featured)}
                  >
                    <Star size={13} fill={product.featured ? "currentColor" : "none"} className="mr-1.5" />
                    {product.featured ? "Destacado" : "No destacado"}
                  </button>
                </form>
              ) : null}
            </div>

            {productId ? (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-bone/10 pt-3">
                <details className="relative">
                  <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-2 border border-bone/12 px-3 text-[10px] font-bold uppercase tracking-rox text-bone/70 transition hover:border-roxgold hover:text-roxgold [&::-webkit-details-marker]:hidden">
                    <MoreHorizontal size={14} /> Mas
                  </summary>
                  <div className="mt-2 grid min-w-44 gap-2 border border-bone/12 bg-ink p-2 md:absolute md:right-0 md:z-20">
                    <form action={changeProductStatusAction}>
                      <input type="hidden" name="id" value={productId} />
                      <input type="hidden" name="status" value="sold_out" />
                      <button type="submit" className={`${actionButtonClass()} w-full justify-start`}>
                        <Flame size={13} className="mr-1.5" /> Agotar
                      </button>
                    </form>
                    <form action={duplicateProductAction}>
                      <input type="hidden" name="id" value={productId} />
                      <button type="submit" className={`${actionButtonClass()} w-full justify-start`}>
                        <Copy size={13} className="mr-1.5" /> Duplicar
                      </button>
                    </form>
                  </div>
                </details>

                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={productId} />
                  <ConfirmDeleteDialog message={`Borrar ${product.name}? Esta accion no se puede deshacer.`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Trash2 size={13} /> Borrar
                    </span>
                  </ConfirmDeleteDialog>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
