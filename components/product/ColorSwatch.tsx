type ColorSwatchProps = {
  color: {
    code: string;
    label: string;
    hex: string | null;
  };
  selected?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  dataProductColor?: string;
};

const sizes = {
  sm: {
    button: "h-5 w-5",
    swatch: "h-3.5 w-3.5"
  },
  md: {
    button: "h-10 w-10",
    swatch: "h-7 w-7"
  },
  lg: {
    button: "h-12 w-12",
    swatch: "h-8 w-8"
  }
};

export function ColorSwatch({ color, selected = false, size = "md", onClick, dataProductColor }: ColorSwatchProps) {
  const classes = sizes[size];
  const borderColor = selected ? "border-roxgold" : "border-bone/20 hover:border-bone/55";
  const bgColor = color.hex || "#111111";

  if (!onClick) {
    return (
      <span className={`grid ${classes.button} place-items-center rounded-full border ${borderColor}`} title={color.label}>
        <span className={`${classes.swatch} rounded-full border border-bone/30 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.22)]`} style={{ backgroundColor: bgColor }} />
      </span>
    );
  }

  return (
    <button
      type="button"
      data-product-color={dataProductColor}
      onClick={onClick}
      className={`grid ${classes.button} place-items-center rounded-full border transition ${borderColor} ${selected ? "bg-roxgold/12 shadow-gold-soft" : "bg-transparent"}`}
      aria-label={color.label}
      aria-pressed={selected}
      title={color.label}
    >
      <span className={`${classes.swatch} rounded-full border border-bone/30 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.22)]`} style={{ backgroundColor: bgColor }} />
    </button>
  );
}
