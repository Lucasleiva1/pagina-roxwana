import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getAdminCustomer } from "@/lib/admin/customers";

type AdminCustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminCustomerPage({ params }: AdminCustomerPageProps) {
  const { id } = await params;
  const detail = await getAdminCustomer(id);

  if (!detail) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Cliente" title={detail.profile.name || "CLIENTE ROXWANA"} description={detail.profile.email || detail.profile.user_id} />

      <section className="grid gap-3 border border-bone/12 bg-charcoal p-5">
        <span className="inline-flex w-fit border border-bone/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-rox text-bone/62">{detail.profile.role}</span>
        <p className="text-sm text-bone/70">Telefono: {detail.profile.phone || "-"}</p>
        <p className="text-sm text-bone/70">Marketing: {detail.profile.marketing_consent ? "Si" : "No"}</p>
        <p className="text-sm text-bone/70">Alta: {new Date(detail.profile.created_at).toLocaleString("es-AR")}</p>
      </section>

      <section className="grid gap-4">
        <AdminHeader eyebrow="Historial" title="PEDIDOS" />
        {detail.orders.length > 0 ? (
          <div className="grid gap-3">
            {detail.orders.map((order) => (
              <Link key={order.id} href={`/admin/pedidos/${order.id}`} className="grid gap-3 border border-bone/12 bg-charcoal p-4 transition hover:border-roxgold/50 md:grid-cols-[1fr_auto]">
                <div>
                  <StatusBadge status={order.status} />
                  <p className="mt-3 text-xs font-bold uppercase tracking-rox text-roxgold">{order.id}</p>
                  <p className="mt-2 text-sm text-bone/62">{order.customer_phone_snapshot}</p>
                </div>
                <p className="text-xs uppercase tracking-rox text-bone/50 md:text-right">{new Date(order.created_at).toLocaleString("es-AR")}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="border border-bone/12 bg-charcoal p-5 text-sm text-bone/62">Sin pedidos todavia.</p>
        )}
      </section>

      <section className="grid gap-4">
        <AdminHeader eyebrow="Carritos" title="CARRITOS" />
        {detail.carts.length > 0 ? (
          <div className="grid gap-3">
            {detail.carts.map((cart) => (
              <article key={cart.id} className="border border-bone/12 bg-charcoal p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={cart.status} />
                  <p className="text-xs uppercase tracking-rox text-bone/50">{new Date(cart.updated_at).toLocaleString("es-AR")}</p>
                </div>
                <div className="mt-4 grid gap-2">
                  {cart.items.length > 0 ? (
                    cart.items.map((item) => (
                      <p key={item.id} className="text-sm text-bone/68">
                        {item.quantity}x {item.product_name_snapshot} / {item.sku}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-bone/44">Sin items.</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-bone/12 bg-charcoal p-5 text-sm text-bone/62">Sin carritos registrados.</p>
        )}
      </section>
    </div>
  );
}
