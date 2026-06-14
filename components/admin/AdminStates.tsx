export function EmptyState({ title, copy }: { title: string; copy?: string }) {
  return (
    <div className="border border-bone/12 bg-charcoal p-6 text-sm text-bone/62">
      <p className="headline text-3xl text-bone">{title}</p>
      {copy ? <p className="mt-2 leading-6">{copy}</p> : null}
    </div>
  );
}

export function LoadingState({ title = "Cargando" }: { title?: string }) {
  return <div className="border border-bone/12 bg-charcoal p-6 text-sm uppercase tracking-rox text-bone/62">{title}</div>;
}

export function ErrorState({ title = "No se pudo cargar", copy }: { title?: string; copy?: string }) {
  return (
    <div className="border border-roxred/40 bg-roxred/10 p-6 text-sm text-bone/78">
      <p className="font-bold uppercase tracking-rox text-roxred">{title}</p>
      {copy ? <p className="mt-2 leading-6">{copy}</p> : null}
    </div>
  );
}
