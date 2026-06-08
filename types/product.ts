export type ProductColor = {
  id?: string;
  code: string;
  label: string;
  hex: string | null;
};

export type ProductSize = string;

export type ProductStatus = "draft" | "active" | "hidden";
export type ProductGender = "hombre" | "mujer" | "unisex";

export type ProductImage = {
  id?: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
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
  colors: ProductColor[];
  sizes: ProductSize[];
  image: string;
  images: ProductImage[];
  slug: string;
  story: string;
  description: string | null;
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
