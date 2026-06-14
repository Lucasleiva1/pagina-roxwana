import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminProfile } from "@/lib/auth/requireAdmin";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Productos", href: "/admin/productos" },
  { label: "Nuevo", href: "/admin/productos/nuevo" },
  { label: "Categorias", href: "/admin/categorias" },
  { label: "Drops", href: "/admin/drops" },
  { label: "Home", href: "/admin/home" },
  { label: "Media", href: "/admin/media" },
  { label: "Clientes", href: "/admin/clientes" },
  { label: "Pedidos", href: "/admin/pedidos" },
  { label: "Carritos", href: "/admin/carritos" },
  { label: "Consultas", href: "/admin/consultas" },
  { label: "Settings", href: "/admin/settings", adminOnly: true },
  { label: "Usuarios", href: "/admin/usuarios", adminOnly: true }
];

export function AdminShell({ children, profile }: { children: ReactNode; profile: AdminProfile }) {
  const visibleItems = navItems.filter((item) => !item.adminOnly || profile.role === "admin");

  return (
    <section className="admin-surface min-h-screen bg-ink pb-20 pt-28">
      <div className="rox-container grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="border border-roxgold/20 bg-charcoal p-4 lg:sticky lg:top-28 lg:h-fit">
          <p className="headline text-3xl text-bone">ADMIN</p>
          <p className="mt-1 text-[10px] uppercase tracking-rox text-roxgold">ROXWANA backstage</p>
          <div className="mt-5 border-y border-bone/10 py-3 text-[10px] uppercase tracking-rox text-bone/54">
            <p>{profile.name || "Acceso interno"}</p>
            <p className="mt-1 text-roxgold">{profile.role}</p>
          </div>
          <nav className="mt-6 grid gap-2">
            {visibleItems.map((item) => (
              <Link key={item.href} href={item.href} className="border border-bone/10 px-3 py-3 text-xs font-bold uppercase tracking-rox text-bone/68 transition hover:border-roxgold hover:text-bone">
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
