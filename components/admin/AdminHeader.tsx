export function AdminHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-rox text-roxgold">{eyebrow}</p>
      <h1 className="headline mt-2 text-5xl leading-none text-bone md:text-7xl">{title}</h1>
      {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-bone/62">{description}</p> : null}
    </div>
  );
}
