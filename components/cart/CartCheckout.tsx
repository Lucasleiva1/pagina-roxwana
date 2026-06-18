"use client";

import { useState, useTransition } from "react";
import { saveCartWhatsAppNotice } from "@/components/cart/CartWhatsAppNotice";
import type { CustomerAddress, CustomerProfile } from "@/types/customer";

export function CartCheckout({ profile, latestAddress }: { profile: CustomerProfile | null; latestAddress: CustomerAddress | null }) {
  const [message, setMessage] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setWhatsappUrl(null);
    setOrderSent(false);

    const formData = new FormData(event.currentTarget);
    formData.set("sourceUrl", window.location.href);

    startTransition(async () => {
      const response = await fetch("/api/orders/checkout", {
        method: "POST",
        body: formData
      });
      const result = (await response.json()) as {
        ok: boolean;
        error: string | null;
        url: string | null;
        fallbackContact: string | null;
        orderId: string | null;
      };

      if (!result.ok) {
        setMessage(result.error || "No se pudo enviar el pedido.");
        return;
      }

      if (result.url) {
        window.open(result.url, "_blank", "noopener,noreferrer");
        setWhatsappUrl(result.url);
        setMessage("Pedido guardado. Se abrio WhatsApp para terminar la compra.");
        saveCartWhatsAppNotice({ url: result.url, message: "Pedido guardado. Se abrio WhatsApp para terminar la compra." });
        setOrderSent(true);
      } else {
        const fallbackMessage = result.fallbackContact || "Pedido guardado. WhatsApp no esta disponible en este momento.";
        setMessage(fallbackMessage);
        setOrderSent(true);
      }

      window.dispatchEvent(new CustomEvent("roxwana-cart-count", { detail: { count: 0 } }));
    });
  };

  return (
    <form onSubmit={submit} className="cart-checkout-panel grid gap-4 border border-roxgold/24 bg-charcoal p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Datos de entrega</p>
        <h2 className="headline mt-2 text-4xl text-bone">CHECKOUT</h2>
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Nombre
        <input name="fullName" defaultValue={latestAddress?.fullName || profile?.name || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Telefono
        <input name="phone" defaultValue={latestAddress?.phone || profile?.phone || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_112px]">
        <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Calle
          <input name="street" defaultValue={latestAddress?.street || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Numero
          <input name="streetNumber" defaultValue={latestAddress?.streetNumber || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Piso / Depto
        <input name="apartment" defaultValue={latestAddress?.apartment || ""} className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Ciudad
          <input name="city" defaultValue={latestAddress?.city || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Provincia
          <input name="province" defaultValue={latestAddress?.province || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid min-w-0 gap-2 text-xs font-bold uppercase tracking-rox text-steel sm:col-span-2">
          CP
          <input name="postalCode" defaultValue={latestAddress?.postalCode || ""} required className="min-h-11 w-full border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Notas
        <textarea name="deliveryNotes" defaultValue={latestAddress?.deliveryNotes || ""} rows={3} className="w-full border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <button type="submit" disabled={isPending} className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:opacity-50">
        {isPending ? "Guardando..." : "Enviar pedido por WhatsApp"}
      </button>
      {message ? (
        <p className={`cart-checkout-message border p-3 text-sm leading-6 ${orderSent ? "border-roxred/50 bg-roxred/10 text-bone" : "border-roxgold/30 bg-roxgold/10 text-bone/78"}`}>
          {message}
        </p>
      ) : null}
      {whatsappUrl ? (
        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-xs font-bold uppercase tracking-rox text-roxgold underline underline-offset-4">
          Abrir WhatsApp
        </a>
      ) : null}
    </form>
  );
}
