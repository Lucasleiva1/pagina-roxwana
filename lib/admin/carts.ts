import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { Database } from "@/types/supabase";

type CartRow = Database["public"]["Tables"]["carts"]["Row"];
type CartItemRow = Database["public"]["Tables"]["cart_items"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type AdminCart = CartRow & {
  items: CartItemRow[];
  profile: ProfileRow | null;
};

function groupByCart(items: CartItemRow[]) {
  return items.reduce<Record<string, CartItemRow[]>>((acc, item) => {
    acc[item.cart_id] = [...(acc[item.cart_id] || []), item];
    return acc;
  }, {});
}

export async function getAdminActiveCarts(): Promise<AdminCart[]> {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: carts, error } = await supabase.from("carts").select("*").eq("status", "active").order("updated_at", { ascending: false });

  if (error || !carts?.length) {
    return [];
  }

  const cartIds = carts.map((cart) => cart.id);
  const userIds = carts.map((cart) => cart.user_id);
  const [itemsResult, profilesResult] = await Promise.all([
    supabase.from("cart_items").select("*").in("cart_id", cartIds).order("created_at", { ascending: true }),
    supabase.from("profiles").select("*").in("user_id", userIds)
  ]);
  const itemsByCart = groupByCart((itemsResult.data || []) as CartItemRow[]);
  const profiles = (profilesResult.data || []) as ProfileRow[];

  return carts.map((cart) => ({
    ...cart,
    items: itemsByCart[cart.id] || [],
    profile: profiles.find((profile) => profile.user_id === cart.user_id) || null
  }));
}
