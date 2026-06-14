import type { SiteSettings } from "@/types/settings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function getFallbackSiteSettings(): SiteSettings {
  return {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
    whatsappLabel: "WhatsApp ROXWANA",
    whatsappEnabled: true,
    fallbackContact: "Escribinos por redes y te respondemos con disponibilidad.",
    instagramUrl: "https://instagram.com",
    tiktokUrl: "https://tiktok.com",
    contactEmail: null,
    globalCtaLabel: "Ver catalogo",
    globalCtaUrl: "/productos"
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return getFallbackSiteSettings();
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getFallbackSiteSettings();
  }

  const { data, error } = await supabase.from("site_settings").select("*").order("created_at", { ascending: true }).limit(1).maybeSingle();

  if (error || !data) {
    return getFallbackSiteSettings();
  }

  return {
    id: data.id,
    whatsappNumber: data.whatsapp_number,
    whatsappLabel: data.whatsapp_label,
    whatsappEnabled: data.whatsapp_enabled,
    fallbackContact: data.fallback_contact,
    instagramUrl: data.instagram_url,
    tiktokUrl: data.tiktok_url,
    contactEmail: data.contact_email,
    globalCtaLabel: data.global_cta_label,
    globalCtaUrl: data.global_cta_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}
