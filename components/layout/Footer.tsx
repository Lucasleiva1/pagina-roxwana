import Link from "next/link";
import { hasConfiguredWhatsAppNumber } from "@/lib/whatsapp/buildWhatsAppUrl";

export function Footer() {
  const links = [
    { label: "Productos", href: "/productos" },
    { label: "Hombre", href: "/hombre" },
    { label: "Mujer", href: "/mujer" },
    { label: "Random", href: "/random" }
  ];

  return (
    <footer className="border-t border-bone/10 bg-ink py-12">
      <div className="rox-container grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="headline text-5xl text-bone">ROXWANA</div>
          <p className="mt-3 max-w-xl text-sm uppercase tracking-rox text-bone/62">
            ROXWANA - ESTILO URBANO, HECHO PARA LA CALLE.
          </p>
          {!hasConfiguredWhatsAppNumber() ? (
            <p className="mt-4 text-xs uppercase tracking-rox text-roxgold/80">
              WhatsApp en modo demo: configurar NEXT_PUBLIC_WHATSAPP_NUMBER para produccion.
            </p>
          ) : null}
        </div>
        <div className="grid gap-6 text-xs font-bold uppercase tracking-rox text-bone/70 sm:grid-cols-2 md:text-right">
          <div className="grid gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-bone">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="transition hover:text-bone">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="transition hover:text-bone">
              TikTok
            </a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="transition hover:text-bone">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
