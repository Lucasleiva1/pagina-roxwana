import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";

function clampQuantity(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(Math.max(Math.round(parsed), 1), 20);
}

async function getActiveCartId() {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return { auth: null, cartId: null };
  }

  const { data: cart } = await auth.supabase.from("carts").select("id").eq("user_id", auth.user.id).eq("status", "active").maybeSingle();

  return { auth, cartId: cart?.id || null };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const { auth, cartId } = await getActiveCartId();

  if (!auth || !cartId) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { quantity?: unknown };
  const quantity = clampQuantity(body.quantity);
  const { error } = await auth.supabase.from("cart_items").update({ quantity, updated_at: new Date().toISOString() }).eq("id", itemId).eq("cart_id", cartId);

  if (error) {
    return NextResponse.json({ ok: false, error: "No se pudo actualizar el producto." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const { auth, cartId } = await getActiveCartId();

  if (!auth || !cartId) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const { error } = await auth.supabase.from("cart_items").delete().eq("id", itemId).eq("cart_id", cartId);

  if (error) {
    return NextResponse.json({ ok: false, error: "No se pudo quitar el producto." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
