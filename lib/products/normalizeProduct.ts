import type { Product, ProductColor, ProductImage, ProductSize } from "@/types/product";
import { getImageColorCode } from "@/lib/products/imageColors";

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
  parent_product_id: string | null;
  family_color_id: string | null;
  gender: Product["gender"];
  description: string | null;
  description_short: string | null;
  description_long: string | null;
  status: Product["status"];
  featured: boolean;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  collection_id: string | null;
  sort_order: number | null;
  main_image_path: string | null;
  whatsapp_message: string | null;
  created_at: string;
  updated_at: string;
  garment_types: LookupRow | null;
  categories: (LookupRow & { description?: string | null }) | null;
  collections: (LookupRow & { description?: string | null; hero_image_path?: string | null; is_active?: boolean }) | null;
  product_colors: { colors: LookupRow | null }[] | null;
  product_sizes: { sizes: LookupRow | null }[] | null;
  product_images: {
    id: string;
    url: string;
    path: string | null;
    bucket: string | null;
    alt: string | null;
    sort_order: number | null;
    is_primary: boolean | null;
    file_type?: string | null;
    size?: number | null;
    image_role?: ProductImage["role"];
    view_number?: string | null;
    color_code?: string | null;
    device_variant?: ProductImage["deviceVariant"];
    original_filename?: string | null;
    created_at: string;
  }[] | null;
  product_variants: {
    id: string;
    size: string | null;
    color: string | null;
    stock: number | null;
    sku: string | null;
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
      path: image.path,
      bucket: image.bucket,
      alt: image.alt,
      sortOrder: image.sort_order || 0,
      isPrimary: Boolean(image.is_primary),
      role: image.image_role || null,
      viewNumber: image.view_number || null,
      deviceVariant: image.device_variant || null,
      originalFilename: image.original_filename || null,
      colorCode: image.color_code || getImageColorCode(image.url)
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryImage = images.find((image) => image.isPrimary) || images.find((image) => image.role === "cover") || images[0];
  const primaryColorCode = primaryImage ? primaryImage.colorCode || getImageColorCode(primaryImage.url) : null;
  const orderedColors = [...colors].sort((a, b) => {
    if (a.code === primaryColorCode) {
      return -1;
    }

    if (b.code === primaryColorCode) {
      return 1;
    }

    return 0;
  });
  const description = record.description || "";
  const variants = (record.product_variants || []).map((variant) => ({
    id: variant.id,
    size: variant.size,
    color: variant.color,
    stock: variant.stock || 0,
    sku: variant.sku
  }));

  return {
    id: record.id,
    modelCode: record.model_code,
    model: getModel(record.model_code, garmentCode),
    name: record.name,
    garmentType: garmentCode,
    garmentTypeId: record.garment_type_id,
    garmentLabel: garment?.name || garmentCode,
    parentProductId: record.parent_product_id,
    familyColorId: record.family_color_id,
    gender: record.gender,
    status: record.status,
    featured: record.featured,
    price: record.price,
    compareAtPrice: record.compare_at_price,
    categoryId: record.category_id,
    categoryLabel: record.categories?.name || null,
    collectionId: record.collection_id,
    collectionLabel: record.collections?.name || null,
    sortOrder: record.sort_order || 0,
    mainImagePath: record.main_image_path,
    whatsappMessage: record.whatsapp_message,
    colors: orderedColors,
    sizes,
    variants,
    image: primaryImage?.url || "/images/products/product-street-rock-001-shirt-desktop.webp",
    images,
    slug: record.slug,
    story: record.description_short || description || record.name,
    description,
    descriptionShort: record.description_short,
    descriptionLong: record.description_long,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

export function normalizeProducts(records: ProductRecord[] | null | undefined) {
  return (records || []).map(normalizeProduct);
}
