import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";

export async function Footer() {
  const settings = await getSiteSettings();
  const whatsappUrl = buildWhatsAppUrl({
    phone: settings.whatsappNumber,
    message: "Hola ROXWANA, quiero hacer una consulta."
  });
  const links = [
    { label: "Productos", href: "/productos" },
    { label: "Hombre", href: "/hombre" },
    { label: "Mujer", href: "/mujer" },
    { label: "Random", href: "/random" }
  ];

  return (
    <footer className="relative overflow-hidden border-t border-roxgold/20 bg-ink py-16">
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(246,243,238,0.05)_0_1px,transparent_1px_10px)]" />
      </div>
      <div className="rox-container relative z-10 grid gap-12 lg:grid-cols-[1fr_0.52fr] lg:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Wear it loud</p>
          <div className="headline mt-3 text-7xl leading-none text-bone md:text-9xl">ROXWANA</div>
          <p className="headline mt-4 max-w-3xl text-3xl leading-none text-bone/90 md:text-5xl">ESTILO URBANO</p>
          <p className="mt-5 max-w-xl text-sm uppercase tracking-rox text-bone/62">Street rock / graphic wear. Hecho para la calle.</p>
          {!settings.whatsappNumber ? (
            <p className="mt-4 text-xs uppercase tracking-rox text-roxgold/80">
              WhatsApp pendiente: configurar site_settings o fallback temporal.
            </p>
          ) : null}
        </div>

        <div className="grid gap-7 text-xs font-bold uppercase tracking-rox text-bone/70 sm:grid-cols-2 lg:text-right">
          <nav className="grid gap-3" aria-label="Footer principal">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-bone">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="grid gap-3">
            <a href={settings.instagramUrl || "https://instagram.com"} target="_blank" rel="noreferrer" className="transition hover:text-bone">
              Instagram
            </a>
            <a href={settings.tiktokUrl || "https://tiktok.com"} target="_blank" rel="noreferrer" className="transition hover:text-bone">
              TikTok
            </a>
            <a href={whatsappUrl || "/productos"} target={whatsappUrl ? "_blank" : undefined} rel={whatsappUrl ? "noreferrer" : undefined} className="transition hover:text-bone">
              <span className="inline-flex items-center gap-2">
                WhatsApp <ArrowUpRight size={14} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
