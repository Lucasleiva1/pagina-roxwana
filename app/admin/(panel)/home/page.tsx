import { AdminHeader } from "@/components/admin/AdminHeader";
import { HomeSectionVisualPreview } from "@/components/admin/AdminVisualPreview";
import { getAdminHomeSections, updateHomeSectionAction } from "@/lib/admin/home";
import { getActiveProducts } from "@/lib/products/queries";

export default async function AdminHomePage() {
  const [sections, products] = await Promise.all([getAdminHomeSections(), getActiveProducts()]);

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Home editable" title="DIRECCION DE ARTE CONTROLADA" description="Editar textos, imagenes, CTA, visibilidad y orden sin abrir un builder libre." />
      <div className="grid gap-5">
        {sections.map((section) => (
          <article key={section.key} className="grid gap-4 border border-bone/12 bg-charcoal p-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <form action={updateHomeSectionAction} className="grid min-w-0 gap-4">
              <input type="hidden" name="key" value={section.key} />
              <input type="hidden" name="type" value={section.type} />
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bone/10 pb-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{section.key}</p>
                  <p className="mt-1 text-xs uppercase tracking-rox text-bone/45">{section.type}</p>
                </div>
                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-rox text-bone/70">
                  <input type="checkbox" name="is_visible" defaultChecked={section.isVisible} />
                  Visible
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
                  Titulo
                  <input name="title" defaultValue={section.title || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
                  Subtitulo / eyebrow
                  <input name="subtitle" defaultValue={section.subtitle || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
                </label>
              </div>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
                Texto
                <textarea name="body" defaultValue={section.body || ""} rows={4} className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
              </label>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_120px]">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
                  Imagen path
                  <input name="image_path" defaultValue={section.imagePath || ""} placeholder="/images/... o path de Storage" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
                  CTA label
                  <input name="cta_label" defaultValue={section.ctaLabel || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
                </label>
                <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
                  Orden
                  <input name="sort_order" type="number" defaultValue={section.sortOrder} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
                </label>
              </div>
              <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel xl:col-span-3">
                CTA URL
                <input name="cta_url" defaultValue={section.ctaUrl || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
              </label>
              <button type="submit" className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
                Guardar seccion
              </button>
            </form>
            <div className="min-w-0">
              <HomeSectionVisualPreview section={section} products={products} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
