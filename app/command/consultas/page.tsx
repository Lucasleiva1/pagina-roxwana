import { CommandHeader } from "@/components/command/CommandHeader";
import { WhatsAppOrdersTable } from "@/components/command/WhatsAppOrdersTable";
import { getWhatsAppOrders } from "@/lib/whatsapp/orders";

export default async function CommandConsultasPage() {
  const orders = await getWhatsAppOrders(100);

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Consultas" title="WHATSAPP ORDERS" description="Registro de consultas guardadas antes de abrir WhatsApp." />
      <WhatsAppOrdersTable orders={orders} />
    </div>
  );
}
