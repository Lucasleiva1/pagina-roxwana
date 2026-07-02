import type { Product, ProductGender, ProductOption, ProductStatus } from "@/types/product";
import type { StudioDeviceVariant, StudioImageRole } from "@/lib/product-studio/imageRules";
import { parseProductImageName } from "@/lib/product-studio/imageRules";

export const PRODUCT_STUDIO_SHEET_VERSION = "ROXWANA Product Sheet v1";

export type ProductStudioOptions = {
  garmentTypes: ProductOption[];
  colors: ProductOption[];
  sizes: ProductOption[];
  categories: ProductOption[];
  collections: ProductOption[];
};

export type StudioNotice = {
  level: "error" | "warning" | "info";
  message: string;
  field?: string;
};

export type StudioVariantDraft = {
  sku: string;
  size: string;
  color: string;
  stock: number;
};

export type StudioExpectedImage = {
  fileName: string;
  role: StudioImageRole;
  viewNumber: string | null;
  colorCode: string | null;
  deviceVariant: StudioDeviceVariant;
  sortOrder: number;
};

export type ProductStudioDraft = {
  modelCode: string;
  name: string;
  slug: string;
  garmentTypeId: string;
  garmentTypeCode: string;
  gender: ProductGender;
  status: ProductStatus;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  categoryCode: string;
  collectionId: string;
  collectionCode: string;
  sortOrder: string;
  descriptionShort: string;
  descriptionLong: string;
  featured: boolean;
  whatsappMessage: string;
  colorIds: string[];
  colorCodes: string[];
  sizeIds: string[];
  sizeCodes: string[];
  variants: StudioVariantDraft[];
  expectedImages: StudioExpectedImage[];
};

export const EMPTY_PRODUCT_STUDIO_DRAFT: ProductStudioDraft = {
  modelCode: "",
  name: "",
  slug: "",
  garmentTypeId: "",
  garmentTypeCode: "",
  gender: "unisex",
  status: "draft",
  price: "",
  compareAtPrice: "",
  categoryId: "",
  categoryCode: "",
  collectionId: "",
  collectionCode: "",
  sortOrder: "0",
  descriptionShort: "",
  descriptionLong: "",
  featured: false,
  whatsappMessage: "",
  colorIds: [],
  colorCodes: [],
  sizeIds: [],
  sizeCodes: [],
  variants: [],
  expectedImages: []
};

export function slugifyStudioValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildStudioSlug(name: string, modelCode?: string) {
  return slugifyStudioValue([name, modelCode].filter(Boolean).join(" "));
}

function normalizeLookup(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function findOptionByCodeNameOrId(options: ProductOption[], value?: string | null) {
  if (!value) {
    return null;
  }

  const normalized = normalizeLookup(value);
  return options.find((option) => option.id === value || normalizeLookup(option.code) === normalized || normalizeLookup(option.name) === normalized) || null;
}

export function variantsToText(variants: StudioVariantDraft[]) {
  return variants.map((variant) => [variant.sku, variant.size, variant.color, variant.stock].join(" | ")).join("\n");
}

export function textToVariants(value: string): StudioVariantDraft[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sku = "", size = "", color = "", stock = "0"] = line.split("|").map((part) => part.trim());
      const parsedStock = Number(stock);
      return {
        sku,
        size,
        color,
        stock: Number.isInteger(parsedStock) && parsedStock >= 0 ? parsedStock : 0
      };
    });
}

export function expectedImageFromFileName(fileName: string, explicitRole?: string | null): StudioExpectedImage {
  const parsed = parseProductImageName(fileName, explicitRole);
  return {
    fileName,
    role: parsed.role,
    viewNumber: parsed.viewNumber,
    colorCode: parsed.colorCode,
    deviceVariant: parsed.deviceVariant,
    sortOrder: parsed.sortOrder
  };
}

export function productToStudioDraft(product: Product | undefined, options: ProductStudioOptions): ProductStudioDraft {
  if (!product) {
    return EMPTY_PRODUCT_STUDIO_DRAFT;
  }

  const garment = findOptionByCodeNameOrId(options.garmentTypes, product.garmentTypeId || product.garmentType);
  const category = findOptionByCodeNameOrId(options.categories, product.categoryId || product.categoryLabel || "");
  const collection = findOptionByCodeNameOrId(options.collections, product.collectionId || product.collectionLabel || "");

  return {
    modelCode: product.modelCode || "",
    name: product.name || "",
    slug: product.slug || "",
    garmentTypeId: product.garmentTypeId || garment?.id || "",
    garmentTypeCode: garment?.code || product.garmentType || "",
    gender: product.gender || "unisex",
    status: product.status || "draft",
    price: product.price ? String(product.price) : "",
    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
    categoryId: product.categoryId || category?.id || "",
    categoryCode: category?.code || "",
    collectionId: product.collectionId || collection?.id || "",
    collectionCode: collection?.code || "",
    sortOrder: String(product.sortOrder || 0),
    descriptionShort: product.descriptionShort || product.story || "",
    descriptionLong: product.descriptionLong || product.description || "",
    featured: Boolean(product.featured),
    whatsappMessage: product.whatsappMessage || "",
    colorIds: product.colors.map((color) => color.id).filter((id): id is string => Boolean(id)),
    colorCodes: product.colors.map((color) => color.code),
    sizeIds: options.sizes.filter((size) => product.sizes.includes(size.code)).map((size) => size.id),
    sizeCodes: product.sizes,
    variants: (product.variants || []).map((variant) => ({
      sku: variant.sku || "",
      size: variant.size || "",
      color: variant.color || "",
      stock: variant.stock || 0
    })),
    expectedImages: []
  };
}

export function mergeStudioDraft(base: ProductStudioDraft, patch: Partial<ProductStudioDraft>): ProductStudioDraft {
  const nextName = patch.name ?? base.name;
  const nextModelCode = patch.modelCode ?? base.modelCode;
  const baseAutoSlug = buildStudioSlug(base.name, base.modelCode);
  const legacyBaseAutoSlug = base.name ? slugifyStudioValue(base.name) : "";
  const shouldRegenerateSlug = Boolean(
    nextName &&
      patch.slug === undefined &&
      (patch.name !== undefined || patch.modelCode !== undefined) &&
      (!base.slug || base.slug === baseAutoSlug || base.slug === legacyBaseAutoSlug)
  );
  const nextSlug = patch.slug !== undefined ? patch.slug || buildStudioSlug(nextName, nextModelCode) : shouldRegenerateSlug ? buildStudioSlug(nextName, nextModelCode) : base.slug;

  return {
    ...base,
    ...patch,
    slug: nextSlug || (nextName ? buildStudioSlug(nextName, nextModelCode) : base.slug)
  };
}

export function buildProductSheetExample() {
  return `${PRODUCT_STUDIO_SHEET_VERSION}
codigo: RXW-REM-STREET-001
nombre: Remera Street Rock 001
slug: remera-street-rock-001
prenda: REM
genero: unisex
estado: draft
precio: 29000
precio_anterior: 35000
categoria: remeras
drop: drop-01
destacado: false
orden: 10
colores: NEG, BLA, GRI
talles: S, M, L, XL
descripcion_corta: Algodon pesado con grafica frontal.
descripcion_larga: |
  Remera urbana de alto impacto.
  Calce comodo, estampa protagonista y energia callejera.
whatsapp: Quiero consultar por la Remera Street Rock 001.
variantes:
  RXW-REM-STREET-001-S-NEG | S | NEG | 4
  RXW-REM-STREET-001-M-NEG | M | NEG | 6
imagenes:
  neg-01-desktop.webp = portada
  neg-01-mobile.webp = portada
  neg-02-desktop.webp = espalda
  neg-03-desktop.webp = hover
  neg-04-desktop.webp = costado
  neg-05-desktop.webp = modelo
  neg-06-desktop.webp = detalle`;
}
