import type { Json } from "@/types/supabase";

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
};

export type AdminCollection = AdminCategory & {
  heroImagePath: string | null;
  isActive: boolean;
};

export type HomeSectionKey = "hero" | "featured_drop" | "featured_products" | "brand_statement" | "how_to_order" | "final_cta";

export type HomeSection = {
  id?: string;
  key: HomeSectionKey;
  type: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  imagePath: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  isVisible: boolean;
  sortOrder: number;
  metadata: Json;
};

export type MediaAsset = {
  id: string;
  path: string;
  bucket: string;
  altText: string | null;
  fileType: string | null;
  size: number | null;
  url: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  userId: string;
  email: string | null;
  name: string | null;
  role: "customer" | "editor" | "admin";
  createdAt: string;
  updatedAt: string | null;
};
