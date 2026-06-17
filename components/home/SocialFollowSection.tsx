import Image from "next/image";
import { Facebook, Instagram, Music2, Youtube, Zap, type LucideIcon } from "lucide-react";

const socialUrl = "https://www.instagram.com/roxwana.info/";

type SocialLink = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

const socialLinks: SocialLink[] = [
  { label: "Instagram", icon: Instagram, href: socialUrl },
  { label: "Facebook", icon: Facebook, href: socialUrl },
  { label: "YouTube", icon: Youtube },
  { label: "TikTok", icon: Music2 }
];

export function SocialFollowSection() {
  return (
    <section className="overflow-hidden bg-bone pb-16 pt-28 text-ink md:pb-20 md:pt-32">
      <div className="rox-container">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-8 text-ink/30">
          <span className="h-px flex-1 bg-ink/20" />
          <div className="text-center">
            <p className="headline text-4xl leading-none tracking-rox text-ink md:text-6xl">ROXWANA</p>
            <p className="mt-3 text-xs font-black uppercase tracking-rox text-ink">
              Estilo urbano
            </p>
          </div>
          <span className="h-px flex-1 bg-ink/20" />
        </div>

        <div className="relative mx-auto mt-9 max-w-5xl">
          <Image
            src="/images/social/social-collage-trim-1122.webp"
            alt="Collage ROXWANA con prendas, modelos y detalles de marca"
            width={1009}
            height={813}
            sizes="(min-width: 1024px) 920px, (min-width: 640px) 82vw, 94vw"
            className="mx-auto h-auto w-full max-w-[940px]"
          />
        </div>

        <div className="mx-auto mt-7 max-w-3xl text-center md:mt-9">
          <h2 className="headline text-5xl leading-[0.94] text-ink md:text-7xl">
            SEGUINOS EN <span className="block">NUESTRAS <span className="text-roxred">REDES</span></span>
          </h2>
          <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-4 text-roxgold">
            <span className="h-px flex-1 bg-roxgold/60" />
            <Zap className="h-5 w-5 fill-roxgold" aria-hidden="true" />
            <span className="h-px flex-1 bg-roxgold/60" />
          </div>
          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-ink/72">
            Contenido exclusivo, nuevos lanzamientos y mucho mas.
          </p>

          <div className="mt-8 flex items-center justify-center gap-5">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              const iconContent = (
                <>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                  <Zap className="absolute -bottom-2 h-4 w-4 fill-roxgold text-roxgold opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                </>
              );

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="group relative grid h-14 w-14 place-items-center rounded-full border border-ink/28 bg-bone text-ink transition hover:border-roxgold hover:bg-ink hover:text-bone"
                >
                  {iconContent}
                </a>
              ) : (
                <span
                  key={item.label}
                  aria-label={`${item.label} proximamente`}
                  title={`${item.label} proximamente`}
                  className="group relative grid h-14 w-14 cursor-not-allowed place-items-center rounded-full border border-ink/18 bg-bone text-ink/42 transition hover:border-roxred/55 hover:text-roxred"
                >
                  {iconContent}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
