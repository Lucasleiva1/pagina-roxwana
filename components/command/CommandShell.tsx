import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/command" },
  { label: "Productos", href: "/command/productos" },
  { label: "Nuevo", href: "/command/productos/nuevo" },
  { label: "Clientes", href: "/command/clientes" },
  { label: "Pedidos", href: "/command/pedidos" },
  { label: "Carritos", href: "/command/carritos" },
  { label: "Settings", href: "/command/settings" },
  { label: "Consultas", href: "/command/consultas" }
];

export function CommandShell({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen bg-ink pb-20 pt-28">
      <div className="rox-container grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="border border-roxgold/20 bg-charcoal p-4 lg:sticky lg:top-28 lg:h-fit">
          <p className="headline text-3xl text-bone">COMMAND</p>
          <p className="mt-1 text-[10px] uppercase tracking-rox text-roxgold">ROXWANA private</p>
          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="border border-bone/10 px-3 py-3 text-xs font-bold uppercase tracking-rox text-bone/68 transition hover:border-roxred hover:text-bone">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
