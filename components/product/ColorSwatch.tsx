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
    button: "h-5 w-5"
  },
  md: {
    button: "h-9 w-9"
  },
  lg: {
    button: "h-11 w-11"
  }
};

export function ColorSwatch({ color, selected = false, size = "md", onClick, dataProductColor }: ColorSwatchProps) {
  const classes = sizes[size];
  const borderColor = selected ? "border-roxgold" : "border-bone/28 hover:border-bone/60";
  const glow = selected ? "shadow-[0_0_18px_rgba(202,164,102,0.52)]" : "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.24)] hover:shadow-[0_0_12px_rgba(246,243,238,0.14)]";
  const bgColor = color.hex || "#111111";

  if (!onClick) {
    return (
      <span className={`${classes.button} block rounded-full border ${borderColor} ${glow}`} title={color.label} style={{ backgroundColor: bgColor }} />
    );
  }

  return (
    <button
      type="button"
      data-product-color={dataProductColor}
      onClick={onClick}
      className={`${classes.button} rounded-full border transition focus:outline-none focus-visible:border-roxgold focus-visible:shadow-[0_0_0_2px_rgba(202,164,102,0.36),0_0_18px_rgba(202,164,102,0.46)] ${borderColor} ${glow}`}
      style={{ backgroundColor: bgColor }}
      aria-label={color.label}
      aria-pressed={selected}
      title={color.label}
    />
  );
}
