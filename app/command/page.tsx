import Link from "next/link";
import { CommandHeader } from "@/components/command/CommandHeader";
import { CommandStat } from "@/components/command/CommandStat";
import { ProductTable } from "@/components/command/ProductTable";
import { getProductsForCommand } from "@/lib/products/queries";
import { getWhatsAppOrders } from "@/lib/whatsapp/orders";

export default async function CommandPage() {
  const [products, orders] = await Promise.all([getProductsForCommand(), getWhatsAppOrders(5)]);
  const active = products.filter((product) => product.status === "active").length;
  const draft = products.filter((product) => product.status === "draft").length;
  const hidden = products.filter((product) => product.status === "hidden").length;

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Dashboard" title="ROXWANA CONTROL" description="Vista rapida del catalogo y las consultas recibidas." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CommandStat label="Productos" value={products.length} />
        <CommandStat label="Activos" value={active} />
        <CommandStat label="Borradores" value={draft} />
        <CommandStat label="Ocultos" value={hidden} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/command/productos/nuevo" className="border border-roxred bg-roxred px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Nuevo producto
        </Link>
        <Link href="/command/settings" className="border border-bone/20 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Settings
        </Link>
      </div>
      <section className="grid gap-4">
        <CommandHeader eyebrow="Ultimos movimientos" title="CONSULTAS" />
        <div className="grid gap-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="border border-bone/12 bg-charcoal p-4">
                <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{order.modelCode || "Consulta"}</p>
                <p className="mt-2 text-sm text-bone/70">{order.productName || order.message}</p>
              </div>
            ))
          ) : (
            <p className="border border-bone/12 bg-charcoal p-4 text-sm text-bone/62">Todavia no hay consultas.</p>
          )}
        </div>
      </section>
      <section className="grid gap-4">
        <CommandHeader eyebrow="Catalogo" title="PRODUCTOS" />
        <ProductTable products={products.slice(0, 6)} />
      </section>
    </div>
  );
}
