import Image from "next/image";
import Link from "next/link";

export default function NosotrosPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-ink pt-24 text-bone">
      <Image
        src="/images/nosotros/nosotros-street-1920.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 100vw, 0vw"
        className="hidden object-cover object-[34%_center] opacity-68 md:block"
      />
      <Image
        src="/images/nosotros/nosotros-street-768.webp"
        alt=""
        fill
        priority
        sizes="(min-width: 768px) 0vw, 100vw"
        className="object-cover object-[35%_center] opacity-62 md:hidden"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#080808_0%,rgba(8,8,8,0.84)_40%,rgba(8,8,8,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_42%,rgba(8,8,8,0.62)_100%)]" />

      <div className="rox-container relative z-10 flex min-h-[calc(100vh-6rem)] items-center py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Nosotros</p>
          <h1 className="headline mt-4 text-6xl leading-none text-bone md:text-9xl">ROXWANA</h1>
          <p className="headline mt-4 text-3xl leading-none text-bone/92 md:text-5xl">Street rock / graphic wear</p>
          <p className="mt-7 max-w-2xl text-base leading-8 text-bone/74 md:text-lg">
            ROXWANA nace de la mezcla entre calle, grafica fuerte y energia rockera. Creamos prendas con presencia visual, pensadas para quienes buscan vestir con identidad propia y actitud directa.
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-bone/62">
            Cada modelo se trabaja como una pieza del universo de la marca: contraste, textura, ruido urbano y detalles que se sienten tanto en la imagen como en el uso diario.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/productos" className="inline-flex min-h-11 items-center justify-center bg-bone px-5 text-xs font-black uppercase tracking-rox text-charcoal transition hover:bg-roxgold">
              Todos los modelos
            </Link>
            <Link href="/random" className="inline-flex min-h-11 items-center justify-center border border-bone/30 px-5 text-xs font-bold uppercase tracking-rox text-bone transition hover:border-roxgold hover:text-roxgold">
              Ir a la ruleta
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
