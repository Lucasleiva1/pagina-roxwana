import { AdminLoginForm } from "@/app/admin-login/AdminLoginForm";
import { getSafeReturnPath } from "@/lib/auth/redirects";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const safeReturnUrl = getSafeReturnPath(params?.returnUrl, "/command").startsWith("/command") ? getSafeReturnPath(params?.returnUrl, "/command") : "/command";

  return (
    <section className="min-h-screen bg-ink pb-20 pt-32">
      <div className="rox-container grid gap-8 lg:grid-cols-[0.9fr_0.75fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Acceso interno</p>
          <h1 className="headline mt-3 text-6xl leading-none text-bone md:text-8xl">COMMAND CENTER</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-bone/62">
            Panel privado para catalogo, clientes, carritos, pedidos y consultas historicas.
          </p>
        </div>
        <AdminLoginForm returnUrl={safeReturnUrl} />
      </div>
    </section>
  );
}
