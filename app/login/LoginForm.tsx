"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSafeReturnPath } from "@/lib/auth/redirects";

type AuthMode = "login" | "register";

type LoginFormProps = {
  returnUrl: string;
  error?: string | null;
};

export function LoginForm({ returnUrl, error: initialError }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(initialError || null);
  const [isPending, startTransition] = useTransition();
  const supabase = createSupabaseBrowserClient();
  const safeReturnUrl = getSafeReturnPath(returnUrl);

  const finish = () => {
    router.replace(safeReturnUrl);
    router.refresh();
  };

  const continueWithGoogle = () => {
    setMessage(null);

    if (!supabase) {
      setMessage("Supabase no esta configurado. Completa las variables de entorno primero.");
      return;
    }

    startTransition(async () => {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeReturnUrl)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo
        }
      });

      if (error) {
        setMessage("No se pudo iniciar con Google. Revisa la configuracion OAuth.");
      }
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage("Supabase no esta configurado. Completa las variables de entorno primero.");
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (mode === "register" && cleanName.length < 2) {
      setMessage("Ingresa tu nombre para crear la cuenta.");
      return;
    }

    if (password.length < 6) {
      setMessage("El password tiene que tener al menos 6 caracteres.");
      return;
    }

    startTransition(async () => {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
              marketing_consent: marketingConsent
            }
          }
        });

        if (error) {
          setMessage(error.message || "No se pudo crear la cuenta.");
          return;
        }

        if (!data.session) {
          setMessage("Cuenta creada. Para entrar directo, desactiva la confirmacion de email en Supabase Auth.");
          return;
        }

        finish();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        setMessage("Email o password incorrecto.");
        return;
      }

      finish();
    });
  };

  return (
    <div className="border border-roxgold/24 bg-charcoal p-5 shadow-gold-soft sm:p-6">
      <button
        type="button"
        onClick={continueWithGoogle}
        disabled={isPending}
        className="flex min-h-12 w-full items-center justify-center gap-3 border border-bone bg-bone px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:bg-roxgold disabled:opacity-50"
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] text-bone">G</span>
        Continuar con Google
      </button>

      <div className="my-5 grid grid-cols-2 border border-bone/12">
        {(["login", "register"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setMessage(null);
            }}
            className={`min-h-11 text-xs font-bold uppercase tracking-rox transition ${
              mode === item ? "bg-roxgold text-charcoal" : "text-bone/62 hover:text-bone"
            }`}
          >
            {item === "login" ? "Entrar" : "Registro"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="grid gap-4">
        {mode === "register" ? (
          <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
            Nombre
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
            />
          </label>
        ) : null}
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
        {mode === "register" ? (
          <label className="flex items-start gap-3 border border-bone/12 p-3 text-xs leading-5 text-bone/62">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => setMarketingConsent(event.target.checked)}
            className="mt-1 h-4 w-4 accent-roxgold"
            />
            Quiero recibir novedades de drops y disponibilidad ROXWANA.
          </label>
        ) : null}
        <button
          type="submit"
          disabled={isPending}
          className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:opacity-50"
        >
          {isPending ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      {message ? <p className="mt-4 border border-roxgold/30 bg-roxgold/10 p-3 text-sm leading-6 text-bone/78">{message}</p> : null}
    </div>
  );
}
