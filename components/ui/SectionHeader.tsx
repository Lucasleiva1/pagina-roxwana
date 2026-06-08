type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="mb-3 text-xs font-bold uppercase tracking-rox text-roxgold">{eyebrow}</p>
      <h2 className="headline text-4xl leading-none text-bone md:text-6xl">{title}</h2>
      {description ? <p className="mt-4 text-sm leading-7 text-bone/68 md:text-base">{description}</p> : null}
    </div>
  );
}
