"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
