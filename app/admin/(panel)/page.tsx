import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStat } from "@/components/admin/AdminStat";
import { ProductTable } from "@/components/admin/ProductTable";
import { getAdminCategories, getAdminCollections } from "@/lib/admin/taxonomy";
import { getHomeSections } from "@/lib/home/sections";
import { getProductsForAdmin } from "@/lib/products/queries";

export default async function AdminPage() {
  const [products, categories, collections, sections] = await Promise.all([
    getProductsForAdmin(),
    getAdminCategories(),
    getAdminCollections(),
    getHomeSections({ includeHidden: true })
  ]);
  const published = products.filter((product) => product.status === "published").length;
  const drafts = products.filter((product) => product.status === "draft").length;

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Dashboard" title="ROXWANA ADMIN" description="Backstage operativo para catalogo, drops, home y contenido publico." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStat label="Productos" value={products.length} />
        <AdminStat label="Publicados" value={published} />
        <AdminStat label="Borradores" value={drafts} />
        <AdminStat label="Categorias" value={categories.length} />
        <AdminStat label="Drops" value={collections.length} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/productos/nuevo" className="border border-roxgold bg-roxgold px-5 py-3 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
          Nuevo producto
        </Link>
        <Link href="/admin/home" className="border border-bone/20 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Editar home
        </Link>
        <Link href="/admin/media" className="border border-bone/20 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Subir imagenes
        </Link>
      </div>
      <section className="grid gap-4">
        <AdminHeader eyebrow="Home" title="SECCIONES CONTROLADAS" />
        <div className="grid gap-3 md:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.key} href="/admin/home" className="border border-bone/12 bg-charcoal p-4 transition hover:border-roxgold/50">
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{section.key}</p>
              <p className="mt-2 text-sm text-bone/70">{section.title || section.type}</p>
              <p className="mt-3 text-[10px] uppercase tracking-rox text-bone/45">{section.isVisible ? "Visible" : "Oculta"}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-4">
        <AdminHeader eyebrow="Catalogo" title="PRODUCTOS RECIENTES" />
        <ProductTable products={products.slice(0, 6)} />
      </section>
    </div>
  );
}
