import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { EmptyState } from "@/components/admin/AdminStates";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImagePathPreview } from "@/components/admin/AdminVisualPreview";
import { deleteCollectionAction, getAdminCollections, upsertCollectionAction } from "@/lib/admin/taxonomy";

export default async function AdminDropsPage() {
  const collections = await getAdminCollections();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Drops" title="COLECCIONES" description="Crear drops activos, ordenar campanas y asignar productos desde el formulario de producto." />
      <form action={upsertCollectionAction} className="grid gap-4 border border-bone/12 bg-charcoal p-5 md:grid-cols-[1fr_1fr_120px_auto]">
        <input name="name" required placeholder="Nombre del drop" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <input name="slug" placeholder="slug-auto" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <input name="sort_order" type="number" defaultValue={0} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal">
          Crear
        </button>
        <input name="hero_image_path" placeholder="Path imagen hero del drop" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold md:col-span-2" />
        <label className="flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-rox text-bone/70">
          <input type="checkbox" name="is_active" defaultChecked />
          Activo
        </label>
        <textarea name="description" placeholder="Descripcion" className="border border-bone/12 bg-ink px-4 py-3 text-sm text-bone outline-none focus:border-roxgold md:col-span-4" />
      </form>

      {collections.length === 0 ? (
        <EmptyState title="Sin drops" copy="Crea el primer drop para poder agrupar productos y editar banners de campana." />
      ) : (
        <div className="grid gap-4">
          {collections.map((collection) => (
            <article key={collection.id} className="grid gap-4 border border-bone/12 bg-charcoal p-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid min-w-0 gap-3">
                <form action={upsertCollectionAction} className="grid gap-3 lg:grid-cols-[1fr_1fr_100px_auto]">
                  <input type="hidden" name="id" value={collection.id} />
                  <input name="name" defaultValue={collection.name} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
                  <input name="slug" defaultValue={collection.slug} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
                  <input name="sort_order" type="number" defaultValue={collection.sortOrder} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
                  <button type="submit" className="border border-roxgold px-4 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
                    Guardar
                  </button>
                  <input name="hero_image_path" defaultValue={collection.heroImagePath || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold lg:col-span-2" />
                  <label className="flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-rox text-bone/70">
                    <input type="checkbox" name="is_active" defaultChecked={collection.isActive} />
                    Activo
                  </label>
                  <textarea name="description" defaultValue={collection.description || ""} className="border border-bone/12 bg-ink px-4 py-3 text-sm text-bone outline-none focus:border-roxgold lg:col-span-4" />
                </form>
                <form action={deleteCollectionAction}>
                  <input type="hidden" name="id" value={collection.id} />
                  <ConfirmDeleteDialog message={`Borrar drop ${collection.name}? Los productos quedaran sin drop.`}>Borrar drop</ConfirmDeleteDialog>
                </form>
              </div>
              <ImagePathPreview imagePath={collection.heroImagePath} title={collection.name} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
