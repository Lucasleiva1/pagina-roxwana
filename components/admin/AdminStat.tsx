export function AdminStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-bone/12 bg-charcoal p-5 shadow-gold-soft">
      <p className="text-[10px] font-bold uppercase tracking-rox text-steel">{label}</p>
      <p className="headline mt-3 text-5xl text-bone">{value}</p>
    </div>
  );
}
