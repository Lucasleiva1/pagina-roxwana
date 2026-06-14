import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-8">
      <AdminHeader eyebrow="Settings" title="CONTACTO Y CTA GLOBAL" description="Solo admins pueden editar WhatsApp, redes, email y CTA global." />
      <SettingsForm settings={settings} />
    </div>
  );
}
