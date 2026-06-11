import { CommandHeader } from "@/components/command/CommandHeader";
import { ProductTable } from "@/components/command/ProductTable";
import { getProductsForCommand } from "@/lib/products/queries";

type ProductosCommandProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function CommandProductosPage({ searchParams }: ProductosCommandProps) {
  const params = (await searchParams) || {};
  const q = (getParam(params, "q") || "").toLowerCase();
  const status = getParam(params, "status") || "all";
  const products = (await getProductsForCommand()).filter((product) => {
    const matchesQuery = !q || product.name.toLowerCase().includes(q) || product.modelCode.toLowerCase().includes(q);
    const matchesStatus = status === "all" || product.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Catalogo" title="PRODUCTOS" description="Editar, activar, ocultar o duplicar modelos sin perder identidad ROXWANA." />
      <form className="grid gap-3 border border-bone/12 bg-charcoal p-4 md:grid-cols-[1fr_auto_auto]" action="/command/productos">
        <input name="q" defaultValue={q} placeholder="Buscar producto" className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none focus:border-roxgold" />
        <select name="status" defaultValue={status} className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="draft">Borradores</option>
          <option value="hidden">Ocultos</option>
        </select>
        <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
          Buscar
        </button>
      </form>
      <ProductTable products={products} />
    </div>
  );
}
