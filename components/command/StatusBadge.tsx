import type { ProductStatus } from "@/types/product";
import type { WhatsAppOrderStatus } from "@/types/settings";

const labels: Record<ProductStatus | WhatsAppOrderStatus, string> = {
  active: "Activo",
  draft: "Borrador",
  hidden: "Oculto",
  new: "Nuevo",
  read: "Leido",
  done: "Cerrado"
};

const styles: Record<ProductStatus | WhatsAppOrderStatus, string> = {
  active: "border-roxgold/50 text-roxgold",
  draft: "border-bone/20 text-bone/62",
  hidden: "border-roxred/50 text-roxred",
  new: "border-roxred/50 text-roxred",
  read: "border-roxgold/50 text-roxgold",
  done: "border-bone/20 text-bone/62"
};

export function StatusBadge({ status }: { status: ProductStatus | WhatsAppOrderStatus }) {
  return <span className={`inline-flex border px-2.5 py-1 text-[10px] font-bold uppercase tracking-rox ${styles[status]}`}>{labels[status]}</span>;
}
