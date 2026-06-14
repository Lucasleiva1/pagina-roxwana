import type { ProductStatus } from "@/types/product";
import type { WhatsAppOrderStatus } from "@/types/settings";
import type { CartStatus, OrderStatus } from "@/types/customer";

type BadgeStatus = ProductStatus | WhatsAppOrderStatus | CartStatus | OrderStatus;

const labels: Record<BadgeStatus, string> = {
  active: "Activo",
  published: "Publicado",
  draft: "Borrador",
  sold_out: "Agotado",
  new: "Nuevo",
  read: "Leido",
  done: "Cerrado",
  converted: "Convertido",
  abandoned: "Abandonado",
  contacted: "Contactado",
  payment_sent: "Pago enviado",
  paid: "Pagado",
  shipped: "Enviado",
  cancelled: "Cancelado"
};

const styles: Record<BadgeStatus, string> = {
  active: "border-roxgold/50 text-roxgold",
  published: "border-roxgold/50 text-roxgold",
  draft: "border-bone/20 text-bone/62",
  sold_out: "border-roxred/50 text-roxred",
  new: "border-roxred/50 text-roxred",
  read: "border-roxgold/50 text-roxgold",
  done: "border-bone/20 text-bone/62",
  converted: "border-bone/20 text-bone/62",
  abandoned: "border-bone/20 text-bone/44",
  contacted: "border-roxgold/50 text-roxgold",
  payment_sent: "border-roxgold/50 text-roxgold",
  paid: "border-emerald-400/50 text-emerald-300",
  shipped: "border-bone/50 text-bone",
  cancelled: "border-roxred/50 text-roxred"
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return <span className={`inline-flex border px-2.5 py-1 text-[10px] font-bold uppercase tracking-rox ${styles[status]}`}>{labels[status]}</span>;
}
