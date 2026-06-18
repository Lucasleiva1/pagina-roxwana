import Image from "next/image";
import Link from "next/link";

export default function NosotrosPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-ink pt-20 text-bone md:pt-24">
      <div className="relative aspect-[16/9] w-full border-b border-roxgold/18 md:absolute md:inset-0 md:aspect-auto md:border-0">
        <Image
          src="/images/nosotros/ntros.png"
          alt="Modelo ROXWANA con remera negra de estilo urbano"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center md:object-[center_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,8,8,0.48)_0%,rgba(8,8,8,0)_52%)] md:bg-[linear-gradient(90deg,rgba(8,8,8,0.40)_0%,rgba(8,8,8,0.12)_50%,rgba(8,8,8,0.03)_100%)]" />
      </div>
      <div className="absolute inset-0 top-20 hidden bg-[linear-gradient(0deg,#080808_0%,rgba(8,8,8,0)_42%,rgba(8,8,8,0.28)_100%)] md:block" />

      <div className="rox-container relative z-10 flex items-center py-14 md:min-h-[calc(100vh-6rem)] md:py-20">
        <div className="max-w-2xl md:rounded-md md:bg-ink/18 md:p-6 md:backdrop-blur-[2px]">
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
