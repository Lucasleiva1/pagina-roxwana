import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isDevAdminEnabled } from "@/lib/auth/devAdmin";
import { getSafeReturnPath } from "@/lib/auth/redirects";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const rawReturnUrl = params?.returnUrl || "/admin";
  const normalizedReturnUrl = getSafeReturnPath(rawReturnUrl, "/admin");
  const safeReturnUrl =
    normalizedReturnUrl.startsWith("/admin") &&
    !normalizedReturnUrl.startsWith("/admin/login") &&
    !normalizedReturnUrl.startsWith("/admin/dev-login")
      ? normalizedReturnUrl
      : "/admin";
  const error =
    params?.error === "forbidden"
      ? "La cuenta de Google entro bien, pero no tiene rol admin/editor en ROXWANA."
      : params?.error === "oauth"
        ? "No se pudo completar el acceso con Google. Revisa que Supabase permita http://127.0.0.1:3000/auth/callback."
        : null;
  const showDevLogin = isDevAdminEnabled();

  return (
    <section className="admin-surface min-h-screen bg-ink pb-20 pt-32">
      <div className="rox-container grid gap-8 lg:grid-cols-[0.9fr_0.75fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Acceso interno</p>
          <h1 className="headline mt-3 text-6xl leading-none text-bone md:text-8xl">ADMIN BACKSTAGE</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-bone/62">
            Panel privado para catalogo, drops, home, imagenes, settings y usuarios autorizados.
          </p>
        </div>
        <div className="grid gap-3">
          <AdminLoginForm returnUrl={safeReturnUrl} error={error} />
          {showDevLogin ? (
            <a
              href={`/admin/dev-login?returnUrl=${encodeURIComponent(safeReturnUrl)}`}
              className="grid min-h-11 place-items-center border border-bone/16 bg-ink px-4 text-xs font-bold uppercase tracking-rox text-bone/70 transition hover:border-roxgold hover:text-roxgold"
            >
              Entrar local
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
