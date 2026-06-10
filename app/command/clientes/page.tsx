import Link from "next/link";
import { CommandHeader } from "@/components/command/CommandHeader";
import { getCommandCustomers } from "@/lib/command/customers";

export default async function CommandCustomersPage() {
  const customers = await getCommandCustomers();

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Clientes" title="CLIENTES" description="Perfiles registrados, historial de pedidos y carritos activos." />
      <div className="grid gap-3">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <Link key={customer.id} href={`/command/clientes/${customer.id}`} className="grid gap-4 border border-bone/12 bg-charcoal p-4 transition hover:border-roxgold/50 md:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex border border-bone/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-rox text-bone/62">{customer.role}</span>
                  <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{customer.email || "Sin email"}</p>
                </div>
                <h2 className="headline mt-3 text-3xl text-bone">{customer.name || "Cliente ROXWANA"}</h2>
                <p className="mt-1 text-sm text-bone/58">{customer.phone || "Sin telefono"}</p>
              </div>
              <div className="grid content-center gap-1 text-right text-xs uppercase tracking-rox text-bone/54">
                <span>{customer.orderCount} pedidos</span>
                <span>{customer.activeCartCount} carritos activos</span>
                <span>{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleString("es-AR") : "Sin pedidos"}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">Todavia no hay clientes registrados.</p>
        )}
      </div>
    </div>
  );
}
