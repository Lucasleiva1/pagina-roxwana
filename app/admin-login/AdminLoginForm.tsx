"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSafeReturnPath } from "@/lib/auth/redirects";

export function AdminLoginForm({ returnUrl }: { returnUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = createSupabaseBrowserClient();
  const safeReturnUrl = getSafeReturnPath(returnUrl, "/command").startsWith("/command") ? getSafeReturnPath(returnUrl, "/command") : "/command";

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!supabase) {
      setError("Supabase no esta configurado. Completa las variables de entorno primero.");
      return;
    }

    startTransition(async () => {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (loginError) {
        setError("Credenciales invalidas.");
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user?.id || "")
        .eq("role", "admin")
        .maybeSingle();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("Este usuario no tiene acceso admin.");
        return;
      }

      router.replace(safeReturnUrl);
      router.refresh();
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border border-roxgold/24 bg-charcoal p-5 shadow-gold-soft">
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Email admin
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
          autoComplete="current-password"
          className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:opacity-50"
      >
        {isPending ? "Verificando..." : "Entrar al Command"}
      </button>
      {error ? <p className="border border-roxred/40 bg-roxred/10 p-3 text-sm text-bone/78">{error}</p> : null}
    </form>
  );
}
