import type { Product, ProductColor, ProductImage, ProductSize } from "@/types/product";

type LookupRow = {
  id: string;
  code: string;
  name: string;
  hex?: string | null;
  sort_order?: number;
};

export type ProductRecord = {
  id: string;
  model_code: string;
  name: string;
  slug: string;
  garment_type_id: string;
  gender: Product["gender"];
  description: string | null;
  status: Product["status"];
  featured: boolean;
  created_at: string;
  updated_at: string;
  garment_types: LookupRow | null;
  product_colors: { colors: LookupRow | null }[] | null;
  product_sizes: { sizes: LookupRow | null }[] | null;
  product_images: {
    id: string;
    url: string;
    alt: string | null;
    sort_order: number | null;
    is_primary: boolean | null;
    created_at: string;
  }[] | null;
};

function getModel(modelCode: string, garmentCode: string) {
  const prefix = `RXW-${garmentCode}-`;
  return modelCode.startsWith(prefix) ? modelCode.slice(prefix.length) : modelCode.replace(/^RXW-/, "");
}

export function normalizeProduct(record: ProductRecord): Product {
  const garment = record.garment_types;
  const garmentCode = garment?.code || "REM";
  const colors = (record.product_colors || [])
    .map((item) => item.colors)
    .filter((item): item is LookupRow => Boolean(item))
    .map<ProductColor>((color) => ({
      id: color.id,
      code: color.code,
      label: color.name,
      hex: color.hex || null
    }));
  const sizes = (record.product_sizes || [])
    .map((item) => item.sizes)
    .filter((item): item is LookupRow => Boolean(item))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map<ProductSize>((size) => size.code);
  const images = (record.product_images || [])
    .map<ProductImage>((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      sortOrder: image.sort_order || 0,
      isPrimary: Boolean(image.is_primary)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryImage = images.find((image) => image.isPrimary) || images[0];
  const description = record.description || "";

  return {
    id: record.id,
    modelCode: record.model_code,
    model: getModel(record.model_code, garmentCode),
    name: record.name,
    garmentType: garmentCode,
    garmentTypeId: record.garment_type_id,
    garmentLabel: garment?.name || garmentCode,
    gender: record.gender,
    status: record.status,
    featured: record.featured,
    colors,
    sizes,
    image: primaryImage?.url || "/images/products/product-01.png",
    images,
    slug: record.slug,
    story: description || record.name,
    description,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

export function normalizeProducts(records: ProductRecord[] | null | undefined) {
  return (records || []).map(normalizeProduct);
}
