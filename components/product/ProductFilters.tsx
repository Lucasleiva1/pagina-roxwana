import type { ProductFilters, ProductOption } from "@/types/product";

type ProductFiltersProps = {
  filters: ProductFilters;
  garmentTypes: ProductOption[];
  colors: ProductOption[];
  sizes: ProductOption[];
};

export function ProductFilters({ filters, garmentTypes, colors, sizes }: ProductFiltersProps) {
  return (
    <form className="grid gap-3 border border-bone/12 bg-charcoal/80 p-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_0.8fr_auto]" action="/productos">
      <input
        name="q"
        defaultValue={filters.q || ""}
        placeholder="Buscar modelo, codigo o nombre"
        className="min-h-11 border border-bone/12 bg-ink px-4 text-sm text-bone outline-none placeholder:text-bone/38 focus:border-roxgold"
      />
      <select name="gender" defaultValue={filters.gender || "all"} className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
        <option value="all">Genero</option>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
        <option value="unisex">Unisex</option>
      </select>
      <select name="garmentType" defaultValue={filters.garmentType || ""} className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
        <option value="">Prenda</option>
        {garmentTypes.map((item) => (
          <option key={item.id} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
      <select name="color" defaultValue={filters.color || ""} className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
        <option value="">Color</option>
        {colors.map((item) => (
          <option key={item.id} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
      <select name="size" defaultValue={filters.size || ""} className="min-h-11 border border-bone/12 bg-ink px-3 text-sm text-bone">
        <option value="">Talle</option>
        {sizes.map((item) => (
          <option key={item.id} value={item.code}>
            {item.name}
          </option>
        ))}
      </select>
      <button type="submit" className="min-h-11 border border-roxred bg-roxred px-5 text-xs font-bold uppercase tracking-rox text-bone">
        Filtrar
      </button>
    </form>
  );
}
