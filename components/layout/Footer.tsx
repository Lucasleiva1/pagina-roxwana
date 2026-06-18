import Link from "next/link";
import { Instagram, Music2, Youtube, type LucideIcon } from "lucide-react";
import { FooterBackground } from "@/components/layout/FooterBackground";

const instagramUrl = "https://www.instagram.com/roxwana.info/";
const youtubeUrl = "https://www.youtube.com/@ROXWANAINFO";
const tiktokUrl = "https://www.tiktok.com/@roxwanainfo";

type SocialLink = {
  label: string;
  icon: LucideIcon;
  href?: string;
  tone: "instagram" | "youtube" | "tiktok";
};

const socialLinks: SocialLink[] = [
  { label: "Instagram", icon: Instagram, href: instagramUrl, tone: "instagram" },
  { label: "YouTube", icon: Youtube, href: youtubeUrl, tone: "youtube" },
  { label: "TikTok", icon: Music2, href: tiktokUrl, tone: "tiktok" }
];

export function Footer() {
  const links = [
    { label: "Productos", href: "/productos" },
    { label: "Hombre", href: "/hombre" },
    { label: "Mujer", href: "/mujer" },
    { label: "Random", href: "/random" }
  ];

  return (
    <footer className="theme-footer relative isolate overflow-hidden border-t border-roxgold/20 bg-ink py-16">
      <FooterBackground />
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[repeating-linear-gradient(135deg,rgba(246,243,238,0.05)_0_1px,transparent_1px_10px)]" />
      </div>
      <div className="rox-container relative z-10 grid gap-12 lg:grid-cols-[1fr_0.52fr] lg:items-end">
        <div>
          <div className="headline text-7xl leading-none text-bone md:text-9xl">ROXWANA</div>
          <p className="headline mt-4 max-w-3xl text-3xl leading-none text-bone/90 md:text-5xl">ESTILO URBANO</p>
        </div>

        <div className="grid gap-7 text-xs font-bold uppercase tracking-rox text-bone/70 sm:grid-cols-2 lg:text-right">
          <nav className="grid gap-3" aria-label="Footer principal">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-bone">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-3 lg:justify-end" aria-label="Redes sociales">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              const className =
                `social-brand-link social-${item.tone} grid h-10 w-10 place-items-center rounded-full border border-bone/24 bg-ink/45 text-bone/72`;

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className={className}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ) : (
                <span
                  key={item.label}
                  aria-label={`${item.label} proximamente`}
                  title={`${item.label} proximamente`}
                  className={`${className} cursor-not-allowed opacity-55 hover:border-roxred/60 hover:text-roxred`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
