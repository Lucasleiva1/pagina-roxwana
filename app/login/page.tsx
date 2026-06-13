import { LoginForm } from "@/app/login/LoginForm";
import { getSafeReturnPath } from "@/lib/auth/redirects";

type LoginPageProps = {
  searchParams?: Promise<{
    returnUrl?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnUrl = getSafeReturnPath(params?.returnUrl);
  const error = params?.error === "oauth" ? "No se pudo completar el acceso con Google." : null;

  return (
    <section className="min-h-screen bg-ink pb-20 pt-28">
      <div className="rox-container grid gap-8 lg:grid-cols-[0.85fr_0.72fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Cuenta ROXWANA</p>
          <h1 className="headline mt-3 text-6xl leading-none text-bone md:text-8xl">ENTRA AL SHOP</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-bone/62">
            Guarda tu carrito, vuelve a tus modelos elegidos y completa el pedido por WhatsApp con tus datos listos.
          </p>
          <div className="mt-8 grid gap-3 border-l border-roxgold/40 pl-5 text-sm text-bone/66">
            <p>Entra con Google o con email y password.</p>
            <p>El registro manual solo pide nombre, email y password.</p>
          </div>
        </div>
        <LoginForm returnUrl={returnUrl} error={error} />
      </div>
    </section>
  );
}
