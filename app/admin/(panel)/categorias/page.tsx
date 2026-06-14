import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { EmptyState } from "@/components/admin/AdminStates";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { deleteCategoryAction, getAdminCategories, upsertCategoryAction } from "@/lib/admin/taxonomy";

export default async function AdminCategoriasPage() {
  const categories = await getAdminCategories();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Catalogo" title="CATEGORIAS" description="Agrupan productos publicados y ayudan a ordenar la navegacion publica." />
      <form action={upsertCategoryAction} className="grid gap-4 border border-bone/12 bg-charcoal p-5 md:grid-cols-[1fr_1fr_120px_auto]">
        <input name="name" required placeholder="Nombre" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <input name="slug" placeholder="slug-auto" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <input name="sort_order" type="number" defaultValue={0} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal">
          Crear
        </button>
        <textarea name="description" placeholder="Descripcion" className="border border-bone/12 bg-ink px-4 py-3 text-sm text-bone outline-none focus:border-roxgold md:col-span-4" />
      </form>

      {categories.length === 0 ? (
        <EmptyState title="Sin categorias" copy="Crea la primera categoria para poder publicar productos con una taxonomia clara." />
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <article key={category.id} className="grid gap-3 border border-bone/12 bg-charcoal p-4">
              <form action={upsertCategoryAction} className="grid gap-3 lg:grid-cols-[1fr_1fr_100px_auto]">
                <input type="hidden" name="id" value={category.id} />
                <input name="name" defaultValue={category.name} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
                <input name="slug" defaultValue={category.slug} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
                <input name="sort_order" type="number" defaultValue={category.sortOrder} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
                <button type="submit" className="border border-roxgold px-4 py-2 text-[10px] font-bold uppercase tracking-rox text-roxgold">
                  Guardar
                </button>
                <textarea name="description" defaultValue={category.description || ""} className="border border-bone/12 bg-ink px-4 py-3 text-sm text-bone outline-none focus:border-roxgold lg:col-span-4" />
              </form>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={category.id} />
                <ConfirmDeleteDialog message={`Borrar categoria ${category.name}? Los productos quedaran sin categoria.`}>Borrar categoria</ConfirmDeleteDialog>
              </form>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
