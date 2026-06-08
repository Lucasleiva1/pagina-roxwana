"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { WhatsAppOrder, WhatsAppOrderStatus } from "@/types/settings";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function mapOrder(row: {
  id: string;
  product_id: string | null;
  product_name: string | null;
  model_code: string | null;
  sku: string | null;
  selected_color: string | null;
  selected_size: string | null;
  quantity: number;
  customer_name: string | null;
  customer_phone: string | null;
  source_url: string | null;
  message: string | null;
  status: WhatsAppOrderStatus;
  created_at: string;
}): WhatsAppOrder {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    modelCode: row.model_code,
    sku: row.sku,
    selectedColor: row.selected_color,
    selectedSize: row.selected_size,
    quantity: row.quantity,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    sourceUrl: row.source_url,
    message: row.message,
    status: row.status,
    createdAt: row.created_at
  };
}

export async function getWhatsAppOrders(limit = 50): Promise<WhatsAppOrder[]> {
  await requireAdmin();

  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from("whatsapp_orders").select("*").order("created_at", { ascending: false }).limit(limit);

  if (error) {
    return [];
  }

  return (data || []).map(mapOrder);
}

export async function updateWhatsAppOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const id = formData.get("id");
  const status = formData.get("status");

  if (!supabase || typeof id !== "string" || typeof status !== "string") {
    throw new Error("No se pudo actualizar la consulta.");
  }

  if (!["new", "read", "done"].includes(status)) {
    throw new Error("Estado invalido.");
  }

  await supabase.from("whatsapp_orders").update({ status: status as WhatsAppOrderStatus }).eq("id", id);
  revalidatePath("/command/consultas");
}
