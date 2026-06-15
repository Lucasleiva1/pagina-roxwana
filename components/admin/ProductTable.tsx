import type { Product } from "@/types/product";
import { AdminProductRow } from "@/components/admin/AdminProductRow";

export function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <div className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">No hay productos cargados todavia.</div>;
  }

  return (
    <section className="grid gap-3" aria-label="Listado de productos">
      {products.map((product) => (
        <AdminProductRow key={product.id || product.modelCode} product={product} />
      ))}
    </section>
  );
}
