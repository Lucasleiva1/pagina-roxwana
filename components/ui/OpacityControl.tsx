"use client";

type OpacityControlItem = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
};

type OpacityControlProps = {
  controls?: OpacityControlItem[];
  className?: string;
  label?: string;
  onChange?: (value: number) => void;
  onSave?: () => void;
  saveStatus?: string;
  title?: string;
  value?: number;
};

export function OpacityControl({ className = "", controls, label, onChange, onSave, saveStatus, title, value }: OpacityControlProps) {
  const items = controls || (label && typeof value === "number" && onChange ? [{ label, value, onChange }] : []);

  return (
    <div className={`absolute z-30 w-[min(20rem,calc(100%-2rem))] border border-roxgold/45 bg-ink/88 p-3 shadow-gold-soft backdrop-blur ${className}`}>
      {title ? <p className="mb-3 text-[10px] font-bold uppercase tracking-rox text-bone/72">{title}</p> : null}
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <label className="text-[10px] font-bold uppercase tracking-rox text-roxgold">{item.label}</label>
              <output className="text-[10px] font-bold tabular-nums text-bone/78">{item.value}%</output>
            </div>
            <input
              aria-label={item.label}
              className="mt-2 h-2 w-full accent-roxgold"
              max={item.max ?? 100}
              min={item.min ?? 0}
              onChange={(event) => item.onChange(Number(event.target.value))}
              step={item.step ?? 1}
              type="range"
              value={item.value}
            />
          </div>
        ))}
      </div>
      {onSave ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSave}
            className="min-h-9 border border-roxgold/70 px-3 text-[10px] font-bold uppercase tracking-rox text-roxgold transition hover:bg-roxgold hover:text-charcoal"
          >
            Guardar
          </button>
          {saveStatus ? <span className="text-[10px] font-bold uppercase tracking-rox text-bone/62">{saveStatus}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
