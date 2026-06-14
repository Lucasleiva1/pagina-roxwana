"use client";

import { useMemo, useState } from "react";
import type { Product, ProductOption } from "@/types/product";
import { ImageUploader } from "@/components/admin/ImageUploader";

type ProductFormProps = {
  product?: Product;
  options: {
    garmentTypes: ProductOption[];
    colors: ProductOption[];
    sizes: ProductOption[];
    categories: ProductOption[];
    collections: ProductOption[];
  };
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ product, options, action, submitLabel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const selectedColors = useMemo(() => new Set(product?.colors.map((color) => color.code) || []), [product]);
  const selectedSizes = useMemo(() => new Set(product?.sizes || []), [product]);
  const variants = useMemo(
    () => (product?.variants || []).map((variant) => [variant.sku || "", variant.size || "", variant.color || "", variant.stock].join(" | ")).join("\n"),
    [product]
  );

  return (
    <form action={action} className="grid gap-5 border border-bone/12 bg-charcoal p-5">
      {product?.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Codigo modelo
          <input name="model_code" required defaultValue={product?.modelCode || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Nombre
          <input
            name="name"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!slugTouched) {
                setSlug(slugify(event.target.value));
              }
            }}
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Slug
          <input
            name="slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Prenda
          <select name="garment_type_id" required defaultValue={product?.garmentTypeId || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone">
            <option value="">Elegir</option>
            {options.garmentTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Genero
          <select name="gender" defaultValue={product?.gender || "unisex"} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone">
            <option value="unisex">Unisex</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Estado
          <select name="status" defaultValue={product?.status || "draft"} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone">
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="sold_out">Agotado</option>
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Precio
          <input
            name="price"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={product?.price || ""}
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Precio anterior
          <input
            name="compare_at_price"
            type="number"
            min={0}
            step={1}
            defaultValue={product?.compareAtPrice || ""}
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Categoria
          <select name="category_id" defaultValue={product?.categoryId || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone">
            <option value="">Elegir</option>
            {options.categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Drop / coleccion
          <select name="collection_id" defaultValue={product?.collectionId || ""} className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone">
            <option value="">Sin drop</option>
            {options.collections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Orden visual
          <input
            name="sort_order"
            type="number"
            step={1}
            defaultValue={product?.sortOrder || 0}
            className="min-h-11 border border-bone/12 bg-ink px-4 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
      </div>

      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Descripcion corta
        <textarea name="description_short" defaultValue={product?.descriptionShort || product?.story || ""} rows={3} className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>

      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Descripcion larga
        <textarea name="description_long" defaultValue={product?.descriptionLong || product?.description || ""} rows={6} className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold" />
      </label>

      <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-rox text-bone/70">
        <input type="checkbox" name="featured" defaultChecked={Boolean(product?.featured)} />
        Destacado en home
      </label>

      <label className="grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
        Mensaje WhatsApp personalizado
        <textarea
          name="whatsapp_message"
          defaultValue={product?.whatsappMessage || ""}
          rows={3}
          placeholder="Opcional: texto especial para consulta de este modelo"
          className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <fieldset className="border border-bone/12 p-4">
          <legend className="px-2 text-xs font-bold uppercase tracking-rox text-roxgold">Colores</legend>
          <div className="mt-3 grid gap-2">
            {options.colors.map((color) => (
              <label key={color.id} className="flex items-center gap-3 text-sm text-bone/74">
                <input type="checkbox" name="color_ids" value={color.id} defaultChecked={selectedColors.has(color.code)} />
                <span className="h-4 w-4 border border-bone/24" style={{ backgroundColor: color.hex || "#111111" }} />
                {color.name}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="border border-bone/12 p-4">
          <legend className="px-2 text-xs font-bold uppercase tracking-rox text-roxgold">Talles</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {options.sizes.map((size) => (
              <label key={size.id} className="flex items-center gap-3 text-sm text-bone/74">
                <input type="checkbox" name="size_ids" value={size.id} defaultChecked={selectedSizes.has(size.code)} />
                {size.name}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <fieldset className="border border-bone/12 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-rox text-roxgold">Variantes y stock</legend>
        <label className="mt-3 grid gap-2 text-xs font-bold uppercase tracking-rox text-steel">
          Una variante por linea: SKU | Talle | Color | Stock
          <textarea
            name="variants"
            defaultValue={variants}
            rows={6}
            placeholder="RXW-REM-NEG-S | S | Negro | 5"
            className="border border-bone/12 bg-ink px-4 py-3 text-sm normal-case tracking-normal text-bone outline-none focus:border-roxgold"
          />
        </label>
      </fieldset>

      <fieldset className="border border-bone/12 p-4">
        <legend className="px-2 text-xs font-bold uppercase tracking-rox text-roxgold">Imagenes</legend>
        <ImageUploader images={product?.images || []} />
      </fieldset>

      <button type="submit" className="min-h-12 border border-roxgold bg-roxgold px-5 text-xs font-bold uppercase tracking-rox text-charcoal transition hover:border-bone">
        {submitLabel}
      </button>
    </form>
  );
}
