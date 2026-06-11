import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ManualRegisterBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
  marketingConsent?: unknown;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 500 });
  }

  let body: ManualRegisterBody;

  try {
    body = (await request.json()) as ManualRegisterBody;
  } catch {
    return NextResponse.json({ error: "Datos de registro invalidos." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const marketingConsent = body.marketingConsent === true;

  if (name.length < 2) {
    return NextResponse.json({ error: "Ingresa tu nombre para crear la cuenta." }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Ingresa un email valido." }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "El password tiene que tener al menos 6 caracteres." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    const publicSupabase = await createSupabaseServerClient();

    if (!publicSupabase) {
      return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 500 });
    }

    const { data, error } = await publicSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          marketing_consent: marketingConsent
        }
      }
    });

    if (error) {
      const rateLimited = error.code === "over_email_send_rate_limit" || error.message.toLowerCase().includes("rate limit");

      return NextResponse.json(
        {
          error: rateLimited
            ? "Supabase esta intentando mandar confirmacion y llego al limite de emails. Hay que apagar Confirm email o cargar SUPABASE_SERVICE_ROLE_KEY."
            : error.message || "No se pudo crear la cuenta."
        },
        { status: rateLimited ? 429 : 400 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Cuenta creada, pero Supabase todavia pide confirmar el email antes de entrar." },
        { status: 409 }
      );
    }

    return NextResponse.json({ ok: true });
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      marketing_consent: marketingConsent
    }
  });

  if (error || !data.user) {
    const alreadyExists = error?.message?.toLowerCase().includes("already") || error?.status === 422;
    return NextResponse.json(
      { error: alreadyExists ? "Ese email ya tiene cuenta. Usa Entrar con tu password." : error?.message || "No se pudo crear la cuenta." },
      { status: alreadyExists ? 409 : 400 }
    );
  }

  await supabase.from("profiles").upsert(
    {
      user_id: data.user.id,
      email,
      name,
      role: "customer",
      marketing_consent: marketingConsent
    },
    { onConflict: "user_id" }
  );

  const loginSupabase = await createSupabaseServerClient();

  if (!loginSupabase) {
    return NextResponse.json({ error: "Cuenta creada, pero no se pudo abrir sesion." }, { status: 500 });
  }

  const { error: loginError } = await loginSupabase.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    return NextResponse.json({ error: "Cuenta creada, pero no se pudo abrir sesion automaticamente. Proba entrar con el mismo email y password." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
