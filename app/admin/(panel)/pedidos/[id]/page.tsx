import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { addOrderNoteAction, updateOrderStatusAction } from "@/lib/admin/orderActions";
import { getAdminOrder } from "@/lib/admin/orders";
import type { Json } from "@/types/supabase";
import type { OrderStatus } from "@/types/customer";

const statuses: OrderStatus[] = ["new", "contacted", "payment_sent", "paid", "shipped", "cancelled"];

type AdminOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function jsonText(value: Json) {
  return JSON.stringify(value, null, 2);
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;
  const detail = await getAdminOrder(id);

  if (!detail) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Pedido" title={detail.order.customer_name_snapshot} description={detail.order.id} />

      <section className="grid gap-5 border border-bone/12 bg-charcoal p-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={detail.order.status} />
          <p className="text-xs uppercase tracking-rox text-bone/50">{new Date(detail.order.created_at).toLocaleString("es-AR")}</p>
        </div>
        <div className="grid gap-2 text-sm text-bone/68">
          <p>Email: {detail.order.customer_email_snapshot || "-"}</p>
          <p>Telefono: {detail.order.customer_phone_snapshot}</p>
          <p>Perfil: {detail.profile?.name || detail.profile?.email || detail.order.user_id}</p>
        </div>
        <form action={updateOrderStatusAction} className="flex flex-wrap gap-2">
          <input type="hidden" name="orderId" value={detail.order.id} />
          {statuses.map((status) => (
            <button key={status} type="submit" name="status" value={status} className="h-10 border border-bone/16 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
              {status}
            </button>
          ))}
        </form>
      </section>

      <section className="grid gap-4">
        <AdminHeader eyebrow="Items" title="PRODUCTOS" />
        <div className="grid gap-3">
          {detail.items.map((item) => (
            <article key={item.id} className="border border-bone/12 bg-charcoal p-4">
              <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{item.model_code_snapshot}</p>
              <h2 className="headline mt-2 text-3xl text-bone">{item.product_name_snapshot}</h2>
              <p className="mt-2 text-sm text-bone/62">
                SKU {item.sku} / Color {item.selected_color} / Talle {item.selected_size} / Cantidad {item.quantity}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        <AdminHeader eyebrow="Entrega" title="DIRECCION" />
        <pre className="overflow-auto border border-bone/12 bg-charcoal p-4 text-xs leading-5 text-bone/68">{jsonText(detail.order.shipping_address_snapshot)}</pre>
      </section>

      <section className="grid gap-4">
        <AdminHeader eyebrow="WhatsApp" title="MENSAJE" />
        <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap border border-bone/12 bg-charcoal p-4 text-xs leading-5 text-bone/68">{detail.order.whatsapp_message || "Sin mensaje guardado."}</pre>
      </section>

      <section className="grid gap-4">
        <AdminHeader eyebrow="Notas" title="EVENTOS" />
        <form action={addOrderNoteAction} className="grid gap-3 border border-bone/12 bg-charcoal p-4">
          <input type="hidden" name="orderId" value={detail.order.id} />
          <textarea name="note" rows={3} required className="border border-bone/12 bg-ink px-4 py-3 text-sm text-bone outline-none focus:border-roxgold" placeholder="Nota interna" />
          <button type="submit" className="min-h-11 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
            Agregar nota
          </button>
        </form>
        <div className="grid gap-3">
          {detail.events.length > 0 ? (
            detail.events.map((event) => (
              <article key={event.id} className="border border-bone/12 bg-charcoal p-4">
                <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{event.type}</p>
                <p className="mt-2 text-sm text-bone/68">{event.note || "-"}</p>
                <p className="mt-2 text-xs text-bone/44">{new Date(event.created_at).toLocaleString("es-AR")}</p>
              </article>
            ))
          ) : (
            <p className="border border-bone/12 bg-charcoal p-5 text-sm text-bone/62">Sin eventos.</p>
          )}
        </div>
      </section>
    </div>
  );
}
