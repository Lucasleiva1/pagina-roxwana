import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";

export async function DELETE() {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const { data: cart } = await auth.supabase.from("carts").select("id").eq("user_id", auth.user.id).eq("status", "active").maybeSingle();

  if (cart) {
    const { error } = await auth.supabase.from("cart_items").delete().eq("cart_id", cart.id);

    if (error) {
      return NextResponse.json({ ok: false, error: "No se pudo limpiar el carrito." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
