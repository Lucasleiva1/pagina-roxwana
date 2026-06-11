import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function GET() {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return NextResponse.json({ count: 0 });
  }

  const { data: cart } = await auth.supabase
    .from("carts")
    .select("id")
    .eq("user_id", auth.user.id)
    .eq("status", "active")
    .maybeSingle();

  if (!cart) {
    return NextResponse.json({ count: 0 });
  }

  const { data: items, error } = await auth.supabase
    .from("cart_items")
    .select("quantity")
    .eq("cart_id", cart.id);

  if (error) {
    return NextResponse.json({ count: 0 });
  }

  const count = (items || []).reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);

  return NextResponse.json({ count });
}
