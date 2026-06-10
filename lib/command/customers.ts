import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { CartStatus, OrderStatus } from "@/types/customer";
import type { Database } from "@/types/supabase";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type CartRow = Database["public"]["Tables"]["carts"]["Row"];
type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];

export type CommandCustomer = ProfileRow & {
  orderCount: number;
  activeCartCount: number;
  lastOrderAt: string | null;
};

export type CommandCustomerDetail = {
  profile: ProfileRow;
  orders: OrderRow[];
  carts: Array<CartRow & { items: CartItemRow[] }>;
};

function groupByCart(items: CartItemRow[]) {
  return items.reduce<Record<string, CartItemRow[]>>((acc, item) => {
    acc[item.cart_id] = [...(acc[item.cart_id] || []), item];
    return acc;
  }, {});
}

export async function getCommandCustomers(): Promise<CommandCustomer[]> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: profiles, error } = await supabase.from("profiles").select("*").eq("role", "customer").order("created_at", { ascending: false });

  if (error || !profiles?.length) {
    return [];
  }

  const userIds = profiles.map((profile) => profile.user_id);
  const [ordersResult, cartsResult] = await Promise.all([
    supabase.from("orders").select("id, user_id, status, created_at").in("user_id", userIds),
    supabase.from("carts").select("id, user_id, status").in("user_id", userIds)
  ]);
  const orders = (ordersResult.data || []) as Array<{ id: string; user_id: string; status: OrderStatus; created_at: string }>;
  const carts = (cartsResult.data || []) as Array<{ id: string; user_id: string; status: CartStatus }>;

  return profiles.map((profile) => {
    const customerOrders = orders.filter((order) => order.user_id === profile.user_id);
    const activeCartCount = carts.filter((cart) => cart.user_id === profile.user_id && cart.status === "active").length;
    const lastOrderAt = customerOrders.sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.created_at || null;

    return {
      ...profile,
      orderCount: customerOrders.length,
      activeCartCount,
      lastOrderAt
    };
  });
}

export async function getCommandCustomer(profileId: string): Promise<CommandCustomerDetail | null> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", profileId).maybeSingle();

  if (profileError || !profile) {
    return null;
  }

  const [ordersResult, cartsResult] = await Promise.all([
    supabase.from("orders").select("*").eq("user_id", profile.user_id).order("created_at", { ascending: false }),
    supabase.from("carts").select("*").eq("user_id", profile.user_id).order("updated_at", { ascending: false })
  ]);
  const carts = cartsResult.data || [];
  const cartIds = carts.map((cart) => cart.id);
  const itemsResult =
    cartIds.length > 0 ? await supabase.from("cart_items").select("*").in("cart_id", cartIds).order("created_at", { ascending: true }) : { data: [] as CartItemRow[] };
  const itemsByCart = groupByCart((itemsResult.data || []) as CartItemRow[]);

  return {
    profile,
    orders: ordersResult.data || [],
    carts: carts.map((cart) => ({ ...cart, items: itemsByCart[cart.id] || [] }))
  };
}
