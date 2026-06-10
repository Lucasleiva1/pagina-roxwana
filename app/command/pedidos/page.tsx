import Link from "next/link";
import { CommandHeader } from "@/components/command/CommandHeader";
import { StatusBadge } from "@/components/command/StatusBadge";
import { updateOrderStatusAction } from "@/lib/command/orderActions";
import { getCommandOrders } from "@/lib/command/orders";
import type { OrderStatus } from "@/types/customer";

const statuses: OrderStatus[] = ["new", "contacted", "payment_sent", "paid", "shipped", "cancelled"];

export default async function CommandOrdersPage() {
  const orders = await getCommandOrders();

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Pedidos" title="PEDIDOS" description="Pedidos guardados antes de abrir WhatsApp, con estado y trazabilidad interna." />
      <div className="grid gap-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <article key={order.id} className="grid gap-4 border border-bone/12 bg-charcoal p-4 xl:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={order.status} />
                  <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{new Date(order.created_at).toLocaleString("es-AR")}</p>
                </div>
                <Link href={`/command/pedidos/${order.id}`} className="headline mt-3 block text-3xl text-bone hover:text-roxgold">
                  {order.customer_name_snapshot}
                </Link>
                <p className="mt-2 text-sm text-bone/62">
                  {order.itemCount} items / {order.customer_email_snapshot || "sin email"} / {order.customer_phone_snapshot}
                </p>
              </div>
              <form action={updateOrderStatusAction} className="flex flex-wrap gap-2 xl:justify-end">
                <input type="hidden" name="orderId" value={order.id} />
                {statuses.map((status) => (
                  <button key={status} type="submit" name="status" value={status} className="h-10 border border-bone/16 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
                    {status}
                  </button>
                ))}
              </form>
            </article>
          ))
        ) : (
          <p className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">Todavia no hay pedidos.</p>
        )}
      </div>
    </div>
  );
}
