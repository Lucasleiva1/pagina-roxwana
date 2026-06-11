import { NextResponse } from "next/server";
import { checkoutCartAction } from "@/lib/orders/checkout";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await checkoutCartAction(formData);

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
