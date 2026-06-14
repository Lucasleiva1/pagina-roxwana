import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  "Elegis modelo",
  "Seleccionas talle/color",
  "Agregas al carrito",
  "Completas entrega y WhatsApp"
];

export function HowToOrder() {
  return (
    <section id="ordenar" className="scroll-mt-24 bg-charcoal py-20">
      <div className="rox-container">
        <SectionHeader
          eyebrow="Como ordenar"
          title="DEL MODELO AL PEDIDO"
          description="Elegis la prenda, armas el carrito y mandas el pedido por WhatsApp con tus datos de entrega."
          align="center"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="paper-edge texture-panel border border-bone/14 bg-ink p-6 shadow-gold-soft">
              <span className="headline text-5xl text-roxred">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-8 min-h-14 text-sm font-bold uppercase tracking-rox text-bone">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
