"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { OrderEventType, OrderStatus } from "@/types/customer";

const orderStatuses: OrderStatus[] = ["new", "contacted", "payment_sent", "paid", "shipped", "cancelled"];

const eventByStatus: Partial<Record<OrderStatus, OrderEventType>> = {
  contacted: "admin_contacted",
  payment_sent: "payment_link_sent",
  paid: "paid",
  shipped: "shipped",
  cancelled: "cancelled"
};

export async function updateOrderStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (!supabase || typeof orderId !== "string" || typeof status !== "string" || !orderStatuses.includes(status as OrderStatus)) {
    throw new Error("No se pudo actualizar el pedido.");
  }

  await supabase.from("orders").update({ status: status as OrderStatus }).eq("id", orderId);

  const eventType = eventByStatus[status as OrderStatus];

  if (eventType) {
    await supabase.from("order_events").insert({
      order_id: orderId,
      type: eventType,
      note: `Estado actualizado a ${status}.`,
      created_by: admin.userId
    });
  }

  revalidatePath("/command/pedidos");
  revalidatePath(`/command/pedidos/${orderId}`);
}

export async function addOrderNoteAction(formData: FormData) {
  const admin = await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const orderId = formData.get("orderId");
  const note = formData.get("note");

  if (!supabase || typeof orderId !== "string" || typeof note !== "string" || note.trim().length < 2) {
    throw new Error("No se pudo guardar la nota.");
  }

  await supabase.from("order_events").insert({
    order_id: orderId,
    type: "admin_note",
    note: note.trim().slice(0, 1000),
    created_by: admin.userId
  });

  revalidatePath(`/command/pedidos/${orderId}`);
}
