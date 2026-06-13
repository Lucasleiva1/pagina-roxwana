export function formatPrice(price: number) {
  return `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)}`;
}
