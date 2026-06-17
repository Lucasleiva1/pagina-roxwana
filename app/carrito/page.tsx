import Link from "next/link";
import Image from "next/image";
import { CartCountSync } from "@/components/cart/CartCountSync";
import { CartCheckout } from "@/components/cart/CartCheckout";
import { CartWhatsAppNotice } from "@/components/cart/CartWhatsAppNotice";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { clearCartAction, removeCartItemAction, updateCartItemQuantityAction } from "@/lib/cart/actions";
import { getCustomerCartPageData } from "@/lib/cart/queries";
import { formatPrice } from "@/lib/products/formatPrice";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const { cart, profile, latestAddress, latestWhatsAppNotice } = await getCustomerCartPageData("/carrito");
  const items = cart?.items || [];
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + (item.priceSnapshot || 0) * item.quantity, 0);

  return (
    <section className="min-h-screen bg-ink pb-20 pt-28">
      <CartCountSync count={cartCount} />
      <div className="rox-container grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="grid gap-6">
          <SectionHeader eyebrow="Carrito" title="TU BOLSA" description="Los productos quedan guardados en tu cuenta hasta que envies el pedido." />
          <CartWhatsAppNotice initialNotice={latestWhatsAppNotice} />
          {items.length > 0 ? (
            <div className="grid gap-3">
              {items.map((item) => (
                <article key={item.id} className="grid gap-4 border border-bone/12 bg-charcoal p-4 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="grid min-w-0 grid-cols-[5.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <div className="relative aspect-[3/4] overflow-hidden border border-bone/12 bg-bone">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.productName} fill sizes="112px" className="object-contain object-center p-1.5" />
                      ) : (
                        <div className="grid h-full place-items-center bg-ink">
                          <div className="text-center">
                            <p className="headline text-3xl text-roxgold">RXW</p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-rox text-bone/42">Sin imagen</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="break-words text-xs font-bold uppercase tracking-rox text-roxgold">{item.modelCode}</p>
                      <h2 className="headline mt-2 text-3xl leading-none text-bone">{item.productName}</h2>
                      <p className="mt-2 text-sm leading-6 text-bone/62">
                        SKU {item.sku} / Color {item.selectedColor} / Talle {item.selectedSize}
                      </p>
                      {item.priceSnapshot ? (
                        <p className="mt-3 text-sm font-bold text-bone">
                          {formatPrice(item.priceSnapshot)} x {item.quantity} = {formatPrice(item.priceSnapshot * item.quantity)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid gap-2 md:min-w-48">
                    <form action={updateCartItemQuantityAction} className="flex items-center justify-end gap-2">
                      <input type="hidden" name="itemId" value={item.id} />
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        max={20}
                        defaultValue={item.quantity}
                        className="h-10 w-20 border border-bone/12 bg-ink px-3 text-sm font-bold text-bone outline-none focus:border-roxgold"
                        aria-label="Cantidad"
                      />
                      <button type="submit" className="h-10 border border-bone/16 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold">
                        Actualizar
                      </button>
                    </form>
                    <form action={removeCartItemAction} className="flex justify-end">
                      <input type="hidden" name="itemId" value={item.id} />
                      <button type="submit" className="h-10 border border-roxgold/50 px-3 text-[10px] font-bold uppercase tracking-rox text-roxgold transition hover:border-roxgold hover:bg-roxgold hover:text-charcoal">
                        Quitar
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-bone/12 bg-charcoal p-6">
              <p className="text-sm leading-6 text-bone/62">Todavia no agregaste productos al carrito.</p>
              <Link href="/productos" className="mt-5 inline-flex min-h-11 items-center border border-bone bg-bone px-5 text-xs font-bold uppercase tracking-rox text-charcoal">
                Ver productos
              </Link>
            </div>
          )}
          {items.length > 0 ? (
            <div className="flex items-center justify-between border border-roxgold/30 bg-charcoal p-4">
              <p className="text-xs font-bold uppercase tracking-rox text-steel">Total productos</p>
              <div className="flex flex-wrap items-center justify-end gap-3">
                <p className="text-xl font-black text-roxgold">{formatPrice(cartTotal)}</p>
                <form action={clearCartAction}>
                  <button type="submit" className="min-h-10 border border-bone/16 px-3 text-[10px] font-bold uppercase tracking-rox text-bone transition hover:border-roxgold hover:text-roxgold">
                    Limpiar todo
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
        {items.length > 0 ? <CartCheckout profile={profile} latestAddress={latestAddress} /> : null}
      </div>
    </section>
  );
}
