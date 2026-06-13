"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { getSafeReturnPath } from "@/lib/auth/redirects";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

type LoginFormProps = {
  returnUrl: string;
  error?: string | null;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function LoginForm({ returnUrl, error: initialError }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [message, setMessage] = useState<string | null>(initialError || null);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const safeReturnUrl = getSafeReturnPath(returnUrl);

  const finish = () => {
    router.replace(safeReturnUrl);
    router.refresh();
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

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
        const response = await fetch("/api/auth/manual-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password,
            marketingConsent
          })
        });

        const result = (await response.json().catch(() => ({}))) as {
          error?: string;
          needsPublicSignup?: boolean;
        };

        if (!response.ok) {
          setMessage(result.error || "No se pudo crear la cuenta.");
          return;
        }

        finish();
        return;
      }

      const response = await fetch("/api/auth/manual-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: cleanEmail,
          password
        })
      });

      const result = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setMessage(result.error || "No se pudo entrar.");
        return;
      }

      finish();
    });
  };

  const signInWithGoogle = () => {
    setMessage(null);

    startGoogleTransition(async () => {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setMessage("Supabase no esta configurado para iniciar sesion.");
        return;
      }

      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeReturnUrl)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account"
          }
        }
      });

      if (error) {
        setMessage("No se pudo abrir el acceso con Google.");
      }
    });
  };

  return (
    <div className="border border-roxgold/24 bg-charcoal p-5 shadow-gold-soft sm:p-6">
      <div className="grid grid-cols-2 border border-bone/12">
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

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isGooglePending || isPending}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-sm border border-[#dadce0] bg-white px-5 text-sm font-semibold normal-case tracking-normal text-[#3c4043] shadow-sm transition hover:bg-[#f8fafd] hover:shadow disabled:opacity-50"
      >
        <GoogleIcon />
        {isGooglePending ? "Abriendo Google..." : "Continuar con Google"}
      </button>

      <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] font-bold uppercase tracking-rox text-bone/38">
        <span className="h-px bg-bone/12" />
        O
        <span className="h-px bg-bone/12" />
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
