const steps = [
  { label: "Elegis modelo", copy: "Drop, codigo y prenda que va con tu estilo." },
  { label: "Seleccionas talle/color", copy: "Opciones claras antes de mandar la consulta." },
  { label: "Mandas consulta por WhatsApp", copy: "El pedido sale con detalle para coordinar." },
  { label: "Confirmamos precio y entrega", copy: "Cerramos disponibilidad, pago y envio." }
];

export function OrderTimeline() {
  return (
    <section id="ordenar" className="scroll-mt-24 overflow-hidden bg-charcoal py-20 md:py-24">
      <div className="rox-container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Como ordenar</p>
          <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">DEL MODELO AL MENSAJE</h2>
          <p className="mt-5 text-sm leading-7 text-bone/64">Un flujo simple, con estetica de etiqueta de marca y compra por consulta directa.</p>
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
