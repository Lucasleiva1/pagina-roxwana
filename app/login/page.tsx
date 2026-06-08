import { LoginForm } from "@/app/login/LoginForm";

export default function LoginPage() {
  return (
    <section className="min-h-screen bg-ink pb-20 pt-32">
      <div className="rox-container grid gap-8 lg:grid-cols-[0.9fr_0.75fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-rox text-roxgold">Acceso privado</p>
          <h1 className="headline mt-3 text-6xl leading-none text-bone md:text-8xl">COMMAND CENTER</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-bone/62">
            Panel interno ROXWANA para cargar productos, ajustar WhatsApp y revisar consultas. El primer admin se define manualmente en Supabase.
          </p>
        </div>
        <LoginForm />
      </div>
    </section>
  );
}
