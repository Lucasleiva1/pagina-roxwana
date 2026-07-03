export type ProductColor = {
  id?: string;
  code: string;
  label: string;
  hex: string | null;
};

export type ProductSize = string;

export type ProductStatus = "draft" | "published" | "sold_out";
export type ProductGender = "hombre" | "mujer" | "unisex";

export type ProductImage = {
  id?: string;
  url: string;
  path?: string | null;
  bucket?: string | null;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
  role?: "cover" | "hover" | "gallery" | "detail" | "lifestyle" | "technical" | null;
  viewNumber?: string | null;
  deviceVariant?: "desktop" | "mobile" | "base" | null;
  originalFilename?: string | null;
  colorCode?: string | null;
};

export type ProductVariant = {
  id?: string;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string | null;
};

export type ProductTaxonomy = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
};

export type ProductCollection = ProductTaxonomy & {
  heroImagePath: string | null;
  isActive: boolean;
};

export type Product = {
  id?: string;
  modelCode: string;
  model: string;
  name: string;
  garmentType: string;
  garmentTypeId?: string;
  garmentLabel: string;
  gender: ProductGender;
  status: ProductStatus;
  featured: boolean;
  price: number;
  compareAtPrice?: number | null;
  categoryId?: string | null;
  categoryLabel?: string | null;
  collectionId?: string | null;
  collectionLabel?: string | null;
  parentProductId?: string | null;
  familyColorId?: string | null;
  familyProducts?: Product[];
  sortOrder?: number;
  mainImagePath?: string | null;
  whatsappMessage?: string | null;
  colors: ProductColor[];
  sizes: ProductSize[];
  variants?: ProductVariant[];
  image: string;
  images: ProductImage[];
  slug: string;
  story: string;
  description: string | null;
  descriptionShort?: string | null;
  descriptionLong?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductOption = {
  id: string;
  code: string;
  name: string;
  hex?: string | null;
  sortOrder?: number;
};

export type ProductFilters = {
  gender?: ProductGender | "all";
  garmentType?: string;
  color?: string;
  size?: string;
  q?: string;
  status?: ProductStatus | "all";
};
