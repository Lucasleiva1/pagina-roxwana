import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getAdminActiveCarts } from "@/lib/admin/carts";

export default async function AdminCartsPage() {
  const carts = await getAdminActiveCarts();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Carritos" title="CARRITOS ACTIVOS" description="Clientes con productos guardados antes de convertir a pedido." />
      <div className="grid gap-3">
        {carts.length > 0 ? (
          carts.map((cart) => (
            <article key={cart.id} className="grid gap-4 border border-bone/12 bg-charcoal p-4 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{cart.profile?.email || cart.user_id}</p>
                <h2 className="headline mt-3 text-3xl text-bone">{cart.profile?.name || "Cliente ROXWANA"}</h2>
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
              </div>
              <div className="grid content-center gap-3 text-right">
                <p className="text-xs uppercase tracking-rox text-bone/50">{new Date(cart.updated_at).toLocaleString("es-AR")}</p>
                {cart.profile ? (
                  <Link href={`/admin/clientes/${cart.profile.id}`} className="border border-bone/20 px-4 py-3 text-xs font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
                    Ver cliente
                  </Link>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <p className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">No hay carritos activos.</p>
        )}
      </div>
    </div>
  );
}
