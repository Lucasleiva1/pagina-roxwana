import type { WhatsAppOrder } from "@/types/settings";
import { updateWhatsAppOrderStatusAction } from "@/lib/whatsapp/orders";
import { StatusBadge } from "@/components/admin/StatusBadge";

export function WhatsAppOrdersTable({ orders }: { orders: WhatsAppOrder[] }) {
  if (orders.length === 0) {
    return <div className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">No hay consultas registradas todavia.</div>;
  }

  return (
    <div className="grid gap-3">
      {orders.map((order) => (
        <article key={order.id} className="grid gap-4 border border-bone/12 bg-charcoal p-4 md:grid-cols-[1fr_auto]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={order.status} />
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{order.modelCode || "Sin modelo"}</p>
              <p className="text-xs text-bone/50">{new Date(order.createdAt).toLocaleString("es-AR")}</p>
            </div>
            <h3 className="headline mt-3 text-3xl text-bone">{order.productName || "Consulta ROXWANA"}</h3>
            <p className="mt-2 text-sm text-bone/66">SKU: {order.sku || "-"}</p>
            <p className="mt-1 text-sm text-bone/66">
              Color {order.selectedColor || "-"} / Talle {order.selectedSize || "-"} / Cantidad {order.quantity}
            </p>
            {order.message ? <p className="mt-3 max-w-3xl whitespace-pre-wrap text-xs leading-5 text-bone/54">{order.message}</p> : null}
          </div>
          <form action={updateWhatsAppOrderStatusAction} className="flex flex-wrap gap-2 md:justify-end">
            <input type="hidden" name="id" value={order.id} />
            {(["new", "read", "done"] as const).map((status) => (
              <button key={status} type="submit" name="status" value={status} className="h-10 border border-bone/16 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
                {status}
              </button>
            ))}
          </form>
        </article>
      ))}
    </div>
  );
}
