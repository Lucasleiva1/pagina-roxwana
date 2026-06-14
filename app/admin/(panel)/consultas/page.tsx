import { AdminHeader } from "@/components/admin/AdminHeader";
import { WhatsAppOrdersTable } from "@/components/admin/WhatsAppOrdersTable";
import { getWhatsAppOrders } from "@/lib/whatsapp/orders";

export default async function AdminConsultasPage() {
  const orders = await getWhatsAppOrders(100);

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Consultas" title="WHATSAPP ORDERS" description="Registro de consultas guardadas antes de abrir WhatsApp." />
      <WhatsAppOrdersTable orders={orders} />
    </div>
  );
}
