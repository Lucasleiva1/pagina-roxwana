"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";

function value(formData: FormData, key: string) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim() : "";
}

function cleanUrl(url: string) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("Supabase admin no esta configurado.");
  }

  const id = value(formData, "id");
  const whatsappNumber = value(formData, "whatsapp_number").replace(/[^\d+]/g, "");

  if (whatsappNumber && whatsappNumber.replace(/\D/g, "").length < 8) {
    throw new Error("El numero de WhatsApp no parece valido.");
  }

  const payload = {
    whatsapp_number: whatsappNumber || null,
    whatsapp_label: value(formData, "whatsapp_label") || null,
    whatsapp_enabled: formData.get("whatsapp_enabled") === "on",
    fallback_contact: value(formData, "fallback_contact") || null,
    instagram_url: cleanUrl(value(formData, "instagram_url")),
    tiktok_url: cleanUrl(value(formData, "tiktok_url"))
  };

  if (id) {
    await supabase.from("site_settings").update(payload).eq("id", id);
  } else {
    await supabase.from("site_settings").insert(payload);
  }

  revalidatePath("/");
  revalidatePath("/command/settings");
}
