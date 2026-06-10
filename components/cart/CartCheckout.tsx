"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkoutCartAction } from "@/lib/orders/checkout";
import type { CustomerAddress, CustomerProfile } from "@/types/customer";

export function CartCheckout({ profile, latestAddress }: { profile: CustomerProfile | null; latestAddress: CustomerAddress | null }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setWhatsappUrl(null);

    const formData = new FormData(event.currentTarget);
    formData.set("sourceUrl", window.location.href);

    startTransition(async () => {
      const result = await checkoutCartAction(formData);

      if (!result.ok) {
        setMessage(result.error || "No se pudo enviar el pedido.");
        return;
      }

      if (result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
        setWhatsappUrl(result.url);
        setMessage("Pedido guardado. Se abrio WhatsApp para terminar la compra.");
      } else {
        setMessage(result.fallbackContact || "Pedido guardado. WhatsApp no esta disponible en este momento.");
      }

      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border border-roxgold/24 bg-charcoal p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Datos de entrega</p>
        <h2 className="headline mt-2 text-4xl text-bone">CHECKOUT</h2>
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Nombre
        <input name="fullName" defaultValue={latestAddress?.fullName || profile?.name || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Telefono
        <input name="phone" defaultValue={latestAddress?.phone || profile?.phone || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Calle
          <input name="street" defaultValue={latestAddress?.street || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Numero
          <input name="streetNumber" defaultValue={latestAddress?.streetNumber || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Piso / Depto
        <input name="apartment" defaultValue={latestAddress?.apartment || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Ciudad
          <input name="city" defaultValue={latestAddress?.city || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Provincia
          <input name="province" defaultValue={latestAddress?.province || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          CP
          <input name="postalCode" defaultValue={latestAddress?.postalCode || ""} required className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Notas
        <textarea name="deliveryNotes" defaultValue={latestAddress?.deliveryNotes || ""} rows={3} className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <button type="submit" disabled={isPending} className="min-h-12 border border-roxred bg-roxred px-5 text-xs font-bold uppercase tracking-rox text-bone transition disabled:opacity-50">
        {isPending ? "Guardando..." : "Enviar pedido por WhatsApp"}
      </button>
      {message ? <p className="border border-roxgold/30 bg-roxgold/10 p-3 text-sm leading-6 text-bone/78">{message}</p> : null}
      {whatsappUrl ? (
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-rox text-roxgold underline underline-offset-4">
          Abrir WhatsApp
        </a>
      ) : null}
    </form>
  );
}
