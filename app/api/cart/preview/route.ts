import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { getActiveCartForUser } from "@/lib/cart/queries";

export async function GET() {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    return NextResponse.json({ count: 0, total: 0, items: [] });
  }

  const cart = await getActiveCartForUser(auth.supabase, auth.user.id);
  const items = cart?.items || [];
  const count = items.reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
  const total = items.reduce((sum, item) => sum + (item.priceSnapshot || 0) * item.quantity, 0);
  const sortedItems = [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({
    count,
    total,
    items: sortedItems.slice(0, 4).map((item) => ({
      id: item.id,
      productName: item.productName,
      modelCode: item.modelCode,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      imageUrl: item.imageUrl,
      updatedAt: item.updatedAt
    }))
  });
}
