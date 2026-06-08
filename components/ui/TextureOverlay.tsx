export function TextureOverlay({ intensity = "medium" }: { intensity?: "light" | "medium" | "strong" }) {
  const opacity = {
    light: "opacity-15",
    medium: "opacity-25",
    strong: "opacity-40"
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${opacity[intensity]}`}
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(246,243,238,0.18), transparent 2px), repeating-linear-gradient(135deg, rgba(246,243,238,0.08) 0 1px, transparent 1px 9px)"
      }}
    />
  );
}
