export function AdminHeader({ eyebrow, title, description, compact = false }: { eyebrow: string; title: string; description?: string; compact?: boolean }) {
  return (
    <div>
      <p className={`${compact ? "text-[10px]" : "text-xs"} font-bold uppercase tracking-rox text-roxgold`}>{eyebrow}</p>
      <h1 className={`headline mt-2 leading-none text-bone ${compact ? "text-3xl md:text-4xl" : "text-5xl md:text-7xl"}`}>{title}</h1>
      {description ? <p className={`max-w-2xl text-sm text-bone/62 ${compact ? "mt-2 leading-5" : "mt-4 leading-7"}`}>{description}</p> : null}
    </div>
  );
}
