import Image from "next/image";
import { CalendarDays, Clock3, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";

const deliveryHighlights = [
  {
    icon: PackageCheck,
    title: "Envios a todo el pais",
    copy: "Llegamos a cada rincon de Argentina con seguimiento del pedido."
  },
  {
    icon: Clock3,
    title: "Tiempos estimados",
    copy: "Entre 3 y 7 dias habiles, segun la zona de entrega."
  },
  {
    icon: Truck,
    title: "Seguimiento real",
    copy: "Te compartimos el codigo para seguir el recorrido."
  }
];

const infoItems = [
  {
    icon: MapPin,
    title: "Direccion correcta",
    copy: "Asegurate de completar bien tus datos de envio."
  },
  {
    icon: CalendarDays,
    title: "Dias habiles",
    copy: "Los tiempos empiezan a contar desde que despachamos."
  },
  {
    icon: ShieldCheck,
    title: "Empaque seguro",
    copy: "Tu pedido viaja protegido para llegar en condiciones."
  }
];

export function ShippingSection() {
  return (
    <section id="entregas" className="relative isolate overflow-hidden bg-ink py-20 md:py-24">
      <div className="absolute inset-0 -z-20 bg-ink" />
      <Image
        src="/images/shipping/shipping-map-wide.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-10 hidden object-contain object-right opacity-78 md:block"
      />
      <Image
        src="/images/shipping/shipping-map-portrait.webp"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 -z-10 object-contain object-center opacity-64 drop-shadow-[0_0_42px_rgba(200,164,106,0.2)] md:hidden"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,8,8,0.98),rgba(8,8,8,0.86)_42%,rgba(8,8,8,0.24)_68%,rgba(8,8,8,0.78)),linear-gradient(180deg,rgba(8,8,8,0.9),rgba(8,8,8,0.16)_46%,rgba(8,8,8,0.9))]" />

      <div className="rox-container">
        <div className="grid items-start gap-12 lg:grid-cols-[0.84fr_1.16fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Correo y seguimiento</p>
            <h2 className="headline mt-3 text-5xl leading-none text-bone md:text-7xl">ENTREGAS</h2>
            <p className="mt-3 text-sm font-bold uppercase tracking-rox text-roxgold/82">Llegamos a donde estes</p>
            <p className="mt-7 max-w-md text-sm leading-7 text-bone/68">
              Enviamos a todo el pais con seguimiento en cada etapa. Vas a recibir tu pedido en el tiempo estimado segun tu ubicacion.
            </p>

            <div className="mt-9 grid gap-4">
              {deliveryHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="grid grid-cols-[78px_1fr] items-center gap-5">
                    <div className="grid aspect-square place-items-center border border-bone/10 bg-charcoal/78 text-roxgold shadow-gold-soft">
                      <Icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="headline text-2xl leading-tight text-bone">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-bone/62">{item.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="min-h-[280px] sm:min-h-[340px] md:min-h-[420px] lg:min-h-[480px]" aria-hidden="true" />
        </div>

        <div className="mt-12 border border-bone/10 bg-charcoal/78 p-5 shadow-gold-soft md:p-8">
          <h3 className="headline text-3xl text-roxgold">Info importante</h3>
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            {infoItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className={`text-center ${index > 0 ? "md:border-l md:border-bone/12 md:pl-6" : ""}`}>
                  <Icon className="mx-auto h-8 w-8 text-roxgold" aria-hidden="true" />
                  <h4 className="mt-5 text-xs font-bold uppercase tracking-rox text-bone">{item.title}</h4>
                  <p className="mx-auto mt-3 max-w-[220px] text-xs leading-5 text-bone/62">{item.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
