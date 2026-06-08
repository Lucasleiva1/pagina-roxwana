import Link from "next/link";
import type { Product } from "@/types/product";
import { changeProductStatusAction, duplicateProductAction } from "@/lib/products/mutations";
import { StatusBadge } from "@/components/command/StatusBadge";

export function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <div className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">No hay productos cargados todavia.</div>;
  }

  return (
    <div className="overflow-x-auto border border-bone/12 bg-charcoal">
      <table className="min-w-[860px] w-full border-collapse text-left text-sm">
        <thead className="border-b border-bone/12 text-[10px] uppercase tracking-rox text-steel">
          <tr>
            <th className="p-4">Modelo</th>
            <th className="p-4">Nombre</th>
            <th className="p-4">Prenda</th>
            <th className="p-4">Estado</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id || product.modelCode} className="border-b border-bone/8 text-bone/76">
              <td className="p-4 font-bold text-roxgold">{product.modelCode}</td>
              <td className="p-4">{product.name}</td>
              <td className="p-4">{product.garmentLabel}</td>
              <td className="p-4">
                <StatusBadge status={product.status} />
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/command/productos/${product.id}/editar`} className="border border-bone/16 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
                    Editar
                  </Link>
                  {product.id ? (
                    <>
                      <form action={changeProductStatusAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="status" value={product.status === "active" ? "hidden" : "active"} />
                        <button type="submit" className="border border-bone/16 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxred">
                          {product.status === "active" ? "Ocultar" : "Activar"}
                        </button>
                      </form>
                      <form action={duplicateProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <button type="submit" className="border border-bone/16 px-3 py-2 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
                          Duplicar
                        </button>
                      </form>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
