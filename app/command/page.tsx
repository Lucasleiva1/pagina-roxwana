import Link from "next/link";
import { CommandHeader } from "@/components/command/CommandHeader";
import { CommandStat } from "@/components/command/CommandStat";
import { ProductTable } from "@/components/command/ProductTable";
import { StatusBadge } from "@/components/command/StatusBadge";
import { getCommandActiveCarts } from "@/lib/command/carts";
import { getCommandCustomers } from "@/lib/command/customers";
import { getCommandOrders } from "@/lib/command/orders";
import { getProductsForCommand } from "@/lib/products/queries";
import { getWhatsAppOrders } from "@/lib/whatsapp/orders";

export default async function CommandPage() {
  const [products, legacyOrders, customers, orders, carts] = await Promise.all([
    getProductsForCommand(),
    getWhatsAppOrders(5),
    getCommandCustomers(),
    getCommandOrders(),
    getCommandActiveCarts()
  ]);
  const active = products.filter((product) => product.status === "active").length;

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Dashboard" title="ROXWANA CONTROL" description="Vista rapida del catalogo, clientes, carritos y pedidos." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CommandStat label="Productos" value={products.length} />
        <CommandStat label="Activos" value={active} />
        <CommandStat label="Clientes" value={customers.length} />
        <CommandStat label="Pedidos" value={orders.length} />
        <CommandStat label="Carritos" value={carts.length} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/command/productos/nuevo" className="border border-roxred bg-roxred px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Nuevo producto
        </Link>
        <Link href="/command/pedidos" className="border border-bone/20 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Pedidos
        </Link>
        <Link href="/command/clientes" className="border border-bone/20 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Clientes
        </Link>
        <Link href="/command/settings" className="border border-bone/20 px-5 py-3 text-xs font-bold uppercase tracking-rox text-bone">
          Settings
        </Link>
      </div>
      <section className="grid gap-4">
        <CommandHeader eyebrow="Pedidos" title="ULTIMOS PEDIDOS" />
        <div className="grid gap-3">
          {orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <Link key={order.id} href={`/command/pedidos/${order.id}`} className="border border-bone/12 bg-charcoal p-4 transition hover:border-roxgold/50">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={order.status} />
                  <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{new Date(order.created_at).toLocaleString("es-AR")}</p>
                </div>
                <p className="mt-3 text-sm text-bone/70">{order.customer_name_snapshot}</p>
              </Link>
            ))
          ) : (
            <p className="border border-bone/12 bg-charcoal p-4 text-sm text-bone/62">Todavia no hay pedidos.</p>
          )}
        </div>
      </section>
      <section className="grid gap-4">
        <CommandHeader eyebrow="Legacy" title="CONSULTAS" />
        <div className="grid gap-3">
          {legacyOrders.length > 0 ? (
            legacyOrders.map((order) => (
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
