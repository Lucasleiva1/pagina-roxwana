import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductTable } from "@/components/admin/ProductTable";
import { getProductsForAdmin } from "@/lib/products/queries";

type AdminProductosPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProductosPage({ searchParams }: AdminProductosPageProps) {
  const params = (await searchParams) || {};
  const q = (getParam(params, "q") || "").toLowerCase();
  const status = getParam(params, "status") || "all";
  const products = (await getProductsForAdmin()).filter((product) => {
    const matchesQuery = !q || product.name.toLowerCase().includes(q) || product.modelCode.toLowerCase().includes(q);
    const matchesStatus = status === "all" || product.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AdminHeader eyebrow="Catalogo" title="PRODUCTOS" description="Editar, publicar, agotar, destacar, duplicar o borrar modelos." />
        <Link href="/admin/productos/nuevo" className="border border-roxgold bg-roxgold px-5 py-3 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
          Nuevo producto
        </Link>
      </div>
      <form className="grid gap-3 border border-bone/12 bg-charcoal p-4 md:grid-cols-[1fr_auto_auto]" action="/admin/productos">
        <input name="q" defaultValue={q} placeholder="Buscar producto" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <select name="status" defaultValue={status} className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
          <option value="all">Todos</option>
          <option value="published">Publicados</option>
          <option value="draft">Borradores</option>
          <option value="sold_out">Agotados</option>
        </select>
        <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
          Buscar
        </button>
      </form>
      <ProductTable products={products} />
    </div>
  );
}
