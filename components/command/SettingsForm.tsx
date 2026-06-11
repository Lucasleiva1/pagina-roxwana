import type { SiteSettings } from "@/types/settings";
import { updateSiteSettingsAction } from "@/lib/settings/updateSiteSettings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  return (
    <form action={updateSiteSettingsAction} className="grid gap-5 border border-bone/12 bg-charcoal p-5">
      {settings.id ? <input type="hidden" name="id" value={settings.id} /> : null}
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        WhatsApp numero
        <input name="whatsapp_number" defaultValue={settings.whatsappNumber || ""} placeholder="549..." className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        WhatsApp label
        <input name="whatsapp_label" defaultValue={settings.whatsappLabel || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-rox text-bone/70">
        <input type="checkbox" name="whatsapp_enabled" defaultChecked={settings.whatsappEnabled} />
        WhatsApp habilitado
      </label>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Fallback contacto
        <textarea name="fallback_contact" defaultValue={settings.fallbackContact || ""} rows={4} className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Instagram
          <input name="instagram_url" defaultValue={settings.instagramUrl || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          TikTok
          <input name="tiktok_url" defaultValue={settings.tiktokUrl || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
      </div>
      <button type="submit" className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
        Guardar settings
      </button>
    </form>
  );
}
