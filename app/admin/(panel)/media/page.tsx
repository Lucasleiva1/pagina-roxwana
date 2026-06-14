import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { EmptyState } from "@/components/admin/AdminStates";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { deleteMediaAssetAction, getMediaAssets, uploadMediaAssetAction } from "@/lib/admin/media";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Media" title="IMAGENES Y ASSETS" description="Subir imagenes a Storage y reutilizar bucket/path en productos, drops y home." />
      <form action={uploadMediaAssetAction} className="grid gap-4 border border-bone/12 bg-charcoal p-5 md:grid-cols-[160px_1fr_1fr_auto]">
        <select name="bucket" defaultValue="site-images" className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
          <option value="site-images">site-images</option>
          <option value="product-images">product-images</option>
          <option value="brand-assets">brand-assets</option>
        </select>
        <input name="folder" defaultValue="home" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <input name="alt_text" placeholder="Alt text" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal">
          Subir
        </button>
        <input
          name="file"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          className="min-h-11 border border-bone/12 bg-ink p-3 text-sm text-bone file:mr-4 file:border-0 file:bg-bone file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-rox file:text-charcoal md:col-span-4"
        />
      </form>

      {assets.length === 0 ? (
        <EmptyState title="Sin imagenes subidas" copy="Subi assets para usarlos como hero, banners de drop o previews de productos." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <article key={asset.id} className="grid gap-3 border border-bone/12 bg-charcoal p-3">
              <div className="aspect-[4/3] overflow-hidden border border-bone/10 bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.altText || ""} className="h-full w-full object-cover" />
              </div>
              <div className="grid gap-1 text-xs text-bone/62">
                <p className="font-bold uppercase tracking-rox text-roxgold">{asset.bucket}</p>
                <p className="break-all">{asset.path}</p>
                <p className="break-all text-bone/42">{asset.url}</p>
                <p>{asset.fileType || "image"} · {asset.size ? `${Math.round(asset.size / 1024)} KB` : "sin peso"}</p>
              </div>
              <form action={deleteMediaAssetAction}>
                <input type="hidden" name="id" value={asset.id} />
                <ConfirmDeleteDialog message={`Borrar ${asset.path}?`}>Borrar imagen</ConfirmDeleteDialog>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
