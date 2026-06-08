import { CommandHeader } from "@/components/command/CommandHeader";
import { SettingsForm } from "@/components/command/SettingsForm";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";

export default async function CommandSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-8">
      <CommandHeader eyebrow="Settings" title="CONTACTO Y REDES" description="Configurar WhatsApp real, fallback y enlaces sociales." />
      <SettingsForm settings={settings} />
    </div>
  );
}
