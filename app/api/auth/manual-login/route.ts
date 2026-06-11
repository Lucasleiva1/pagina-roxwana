import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type ManualLoginBody = {
  email?: unknown;
  password?: unknown;
};

function getAuthErrorMessage(message?: string, code?: string) {
  const normalized = `${code || ""} ${message || ""}`.toLowerCase();

  if (normalized.includes("email_not_confirmed") || normalized.includes("email not confirmed")) {
    return "Tu cuenta existe, pero el email todavia no esta confirmado.";
  }

  if (normalized.includes("fetch failed") || normalized.includes("network")) {
    return "No se pudo conectar con Supabase desde el servidor. Revisa la conexion e intenta otra vez.";
  }

  return "Email o password incorrecto.";
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 500 });
  }

  let body: ManualLoginBody;

  try {
    body = (await request.json()) as ManualLoginBody;
  } catch {
    return NextResponse.json({ error: "Datos de acceso invalidos." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !email.includes("@") || password.length < 1) {
    return NextResponse.json({ error: "Ingresa email y password." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 500 });
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return NextResponse.json({ error: getAuthErrorMessage(error.message, error.code) }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
