import type { HomeSection } from "@/types/admin";

const steps = [
  { label: "Elegis modelo", copy: "Mirás la prenda, el codigo y las fotos del drop." },
  { label: "Seleccionas talle/color", copy: "Definis las opciones antes de agregarlo al carrito." },
  { label: "Agregas al carrito", copy: "Tu seleccion queda guardada para revisar el pedido." },
  { label: "Completas entrega y WhatsApp", copy: "Cargas tus datos en el carrito y envias la peticion." }
];

export function OrderTimeline({ section }: { section?: HomeSection | null }) {
  return (
    <section id="ordenar" className="scroll-mt-24 overflow-hidden bg-charcoal py-20 md:py-24">
      <div className="rox-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{section?.subtitle || "Como ordenar"}</p>
          <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">{section?.title || "DEL MODELO AL PEDIDO"}</h2>
          <p className="mt-5 text-sm leading-7 text-bone/64">{section?.body || "Elegis la prenda, armas el carrito y mandas el pedido por WhatsApp con tus datos de entrega."}</p>
        </div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-roxgold/26 md:block" />
          {steps.map((step, index) => (
            <article key={step.label} className={`paper-edge texture-panel relative bg-ink p-6 shadow-gold-soft ${index % 2 === 0 ? "md:mt-0" : "md:mt-10"}`}>
              <span className="headline text-6xl leading-none text-roxred">{String(index + 1).padStart(2, "0")}</span>
              <div className="mt-8 h-px w-16 bg-roxgold" />
              <h3 className="mt-6 min-h-14 text-sm font-bold uppercase tracking-rox text-bone">{step.label}</h3>
              <p className="mt-4 text-sm leading-6 text-bone/62">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
