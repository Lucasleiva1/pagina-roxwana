import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { Database } from "@/types/supabase";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
type OrderEventRow = Database["public"]["Tables"]["order_events"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type CommandOrderListItem = OrderRow & {
  itemCount: number;
};

export type CommandOrderDetail = {
  order: OrderRow;
  items: OrderItemRow[];
  events: OrderEventRow[];
  profile: ProfileRow | null;
};

export async function getCommandOrders(limit = 100): Promise<CommandOrderListItem[]> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(limit);

  if (error || !orders?.length) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);
  const { data: items } = await supabase.from("order_items").select("id, order_id").in("order_id", orderIds);

  return orders.map((order) => ({
    ...order,
    itemCount: (items || []).filter((item) => item.order_id === order.id).length
  }));
}

export async function getCommandOrder(orderId: string): Promise<CommandOrderDetail | null> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();

  if (error || !order) {
    return null;
  }

  const [itemsResult, eventsResult, profileResult] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", order.id).order("created_at", { ascending: true }),
    supabase.from("order_events").select("*").eq("order_id", order.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("user_id", order.user_id).maybeSingle()
  ]);

  return {
    order,
    items: itemsResult.data || [],
    events: eventsResult.data || [],
    profile: profileResult.data || null
  };
}
