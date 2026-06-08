import Link from "next/link";
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
    <footer className="border-t border-bone/10 bg-ink py-12">
      <div className="rox-container grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="headline text-5xl text-bone">ROXWANA</div>
          <p className="mt-3 max-w-xl text-sm uppercase tracking-rox text-bone/62">
            ROXWANA - ESTILO URBANO, HECHO PARA LA CALLE.
          </p>
          {!settings.whatsappNumber ? (
            <p className="mt-4 text-xs uppercase tracking-rox text-roxgold/80">
              WhatsApp pendiente: configurar site_settings o fallback temporal.
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
            <a href={settings.instagramUrl || "https://instagram.com"} target="_blank" rel="noreferrer" className="transition hover:text-bone">
              Instagram
            </a>
            <a href={settings.tiktokUrl || "https://tiktok.com"} target="_blank" rel="noreferrer" className="transition hover:text-bone">
              TikTok
            </a>
            <a href={whatsappUrl || "/productos"} target={whatsappUrl ? "_blank" : undefined} rel={whatsappUrl ? "noreferrer" : undefined} className="transition hover:text-bone">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
