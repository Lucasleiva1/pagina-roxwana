"use client";

import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getSafeReturnPath } from "@/lib/auth/redirects";

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

export function AdminLoginForm({ returnUrl }: { returnUrl: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const supabase = createSupabaseBrowserClient();
  const normalizedReturn = getSafeReturnPath(returnUrl, "/admin");
  const safeReturnUrl = normalizedReturn.startsWith("/admin") && !normalizedReturn.startsWith("/admin/login") ? normalizedReturn : "/admin";

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
        .in("role", ["admin", "editor"])
        .maybeSingle();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setError("Este usuario no tiene acceso interno.");
        return;
      }

      router.replace(safeReturnUrl);
      router.refresh();
    });
  };

  const signInWithGoogle = () => {
    setError(null);

    if (!supabase) {
      setError("Supabase no esta configurado. Completa las variables de entorno primero.");
      return;
    }

    startGoogleTransition(async () => {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeReturnUrl)}`;
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: {
            access_type: "offline",
            prompt: "select_account"
          }
        }
      });

      if (googleError) {
        setError("No se pudo abrir el acceso con Google.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 border border-roxgold/24 bg-charcoal p-5 shadow-gold-soft">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isGooglePending || isPending}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-md border border-[#dadce0] bg-white px-5 text-sm font-semibold normal-case tracking-normal text-[#3c4043] shadow-sm transition hover:bg-[#f8fafd] hover:shadow disabled:opacity-50"
      >
        <GoogleIcon />
        {isGooglePending ? "Abriendo Google..." : "Entrar con Google"}
      </button>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] font-bold uppercase tracking-rox text-bone/38">
        <span className="h-px bg-bone/12" />
        O
        <span className="h-px bg-bone/12" />
      </div>
      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Email interno
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
        <span className="relative block">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            className="min-h-11 w-full border border-bone/12 bg-ink py-0 pl-4 pr-12 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Ocultar password" : "Mostrar password"}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-bone/12 bg-charcoal text-bone/70 transition hover:border-roxgold hover:text-roxgold focus:border-roxgold focus:text-roxgold focus:outline-none"
          >
            {showPassword ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
          </button>
        </span>
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone disabled:opacity-50"
      >
        {isPending ? "Verificando..." : "Entrar al Admin"}
      </button>
      {error ? <p className="border border-roxred/40 bg-roxred/10 p-3 text-sm text-bone/78">{error}</p> : null}
    </form>
  );
}
