import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getSafeReturnPath } from "@/lib/auth/redirects";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const rawReturnUrl = params?.returnUrl || "/admin";
  const safeReturnUrl = getSafeReturnPath(rawReturnUrl, "/admin").startsWith("/admin") ? getSafeReturnPath(rawReturnUrl, "/admin") : "/admin";

  return (
    <section className="min-h-screen bg-ink pb-20 pt-32">
      <div className="rox-container grid gap-8 lg:grid-cols-[0.9fr_0.75fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Acceso interno</p>
          <h1 className="headline mt-3 text-6xl leading-none text-bone md:text-8xl">ADMIN BACKSTAGE</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-bone/62">
            Panel privado para catalogo, drops, home, imagenes, settings y usuarios autorizados.
          </p>
        </div>
        <AdminLoginForm returnUrl={safeReturnUrl} />
      </div>
    </section>
  );
}
