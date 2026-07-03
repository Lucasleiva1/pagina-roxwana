import { mockProducts, roxLisaColors, roxSizes } from "@/data/mockProducts";
import type { Product, ProductFilters, ProductOption, ProductStatus } from "@/types/product";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { normalizeProducts, type ProductRecord } from "@/lib/products/normalizeProduct";

const PRODUCT_SELECT = `
  id,
  model_code,
  name,
  slug,
  garment_type_id,
  parent_product_id,
  family_color_id,
  gender,
  description,
  description_short,
  description_long,
  status,
  featured,
  price,
  compare_at_price,
  category_id,
  collection_id,
  sort_order,
  main_image_path,
  whatsapp_message,
  created_at,
  updated_at,
  garment_types(id, code, name, created_at),
  categories(id, name, slug, description, sort_order, created_at, updated_at),
  collections(id, name, slug, description, hero_image_path, is_active, sort_order, created_at, updated_at),
  product_colors(colors(id, code, name, hex, created_at)),
  product_sizes(sizes(id, code, name, sort_order)),
  product_images(id, url, path, bucket, alt, sort_order, is_primary, file_type, size, image_role, view_number, color_code, device_variant, original_filename, created_at),
  product_variants(id, size, color, stock, sku, created_at, updated_at)
`;

const PRODUCT_SELECT_LEGACY = PRODUCT_SELECT.replace("  parent_product_id,\n  family_color_id,\n", "").replace(
  "product_images(id, url, path, bucket, alt, sort_order, is_primary, file_type, size, image_role, view_number, color_code, device_variant, original_filename, created_at)",
  "product_images(id, url, path, bucket, alt, sort_order, is_primary, file_type, size, created_at)"
);

export type ProductOptions = {
  garmentTypes: ProductOption[];
  colors: ProductOption[];
  sizes: ProductOption[];
  categories: ProductOption[];
  collections: ProductOption[];
};

function canUseMockFallback() {
  return process.env.NODE_ENV !== "production";
}

function fallbackProducts(products: Product[]) {
  if (products.length > 0 || !canUseMockFallback()) {
    return products;
  }

  return mockProducts;
}

function filterProducts(products: Product[], filters: ProductFilters = {}) {
  const q = filters.q?.trim().toLowerCase();

  return products.filter((product) => {
    const matchesGender = !filters.gender || filters.gender === "all" || product.gender === filters.gender || product.gender === "unisex";
    const matchesGarment = !filters.garmentType || product.garmentType === filters.garmentType;
    const matchesColor = !filters.color || product.colors.some((color) => color.code === filters.color);
    const matchesSize = !filters.size || product.sizes.includes(filters.size);
    const matchesStatus = !filters.status || filters.status === "all" || product.status === filters.status;
    const matchesQuery =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.modelCode.toLowerCase().includes(q) ||
      product.model.toLowerCase().includes(q);

    return matchesGender && matchesGarment && matchesColor && matchesSize && matchesStatus && matchesQuery;
  });
}

function productWithoutFamily(product: Product): Product {
  const baseProduct = { ...product };
  delete baseProduct.familyProducts;
  return baseProduct;
}

function attachFamilyProducts(products: Product[]) {
  const familyByRootId = new Map<string, Product[]>();
  const roots: Product[] = [];

  for (const product of products) {
    const rootId = product.parentProductId || product.id;

    if (!rootId) {
      continue;
    }

    if (!product.parentProductId) {
      roots.push(product);
    }

    const family = familyByRootId.get(rootId) || [];
    family.push(productWithoutFamily(product));
    familyByRootId.set(rootId, family);
  }

  return roots.map((root) => {
    const family = familyByRootId.get(root.id || "") || [productWithoutFamily(root)];
    const rootFirstFamily = family.sort((a, b) => {
      if (!a.parentProductId && b.parentProductId) return -1;
      if (a.parentProductId && !b.parentProductId) return 1;
      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });

    return {
      ...root,
      familyProducts: rootFirstFamily
    };
  });
}

async function getProductsFromSupabase(status?: ProductStatus) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [];
  }

  let query = supabase.from("products").select(PRODUCT_SELECT).order("sort_order", { ascending: true }).order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const primary = await query;
  let data: unknown = primary.data;
  let error = primary.error;

  if (error) {
    let legacyQuery = supabase.from("products").select(PRODUCT_SELECT_LEGACY).order("sort_order", { ascending: true }).order("created_at", { ascending: false });

    if (status) {
      legacyQuery = legacyQuery.eq("status", status);
    }

    const legacy = await legacyQuery;
    data = legacy.data;
    error = legacy.error;
  }

  if (error) {
    return [];
  }

  return normalizeProducts(data as ProductRecord[]);
}

export async function getActiveProducts() {
  return fallbackProducts(attachFamilyProducts(await getProductsFromSupabase("published")));
}

export async function getFeaturedProducts() {
  const products = fallbackProducts(attachFamilyProducts(await getProductsFromSupabase("published")));
  return products.filter((product) => product.featured);
}

export async function getProductBySlug(slug: string, includeHidden = false) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      let query = supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug);

      if (!includeHidden) {
        query = query.eq("status", "published");
      }

      const primary = await query.maybeSingle();
      let data: unknown = primary.data;
      let error = primary.error;

      if (error) {
        let legacyQuery = supabase.from("products").select(PRODUCT_SELECT_LEGACY).eq("slug", slug);

        if (!includeHidden) {
          legacyQuery = legacyQuery.eq("status", "published");
        }

        const legacy = await legacyQuery.maybeSingle();
        data = legacy.data;
        error = legacy.error;
      }

      if (!error && data) {
        const current = data as ProductRecord;
        const rootId = current.parent_product_id || current.id;

        if (rootId) {
          let familyQuery = supabase.from("products").select(PRODUCT_SELECT).or(`id.eq.${rootId},parent_product_id.eq.${rootId}`).order("sort_order", { ascending: true }).order("created_at", { ascending: false });

          if (!includeHidden) {
            familyQuery = familyQuery.eq("status", "published");
          }

          const familyResult = await familyQuery;

          if (!familyResult.error && familyResult.data?.length) {
            return attachFamilyProducts(normalizeProducts(familyResult.data as unknown as ProductRecord[]))[0] || null;
          }
        }

        return normalizeProducts([current])[0] || null;
      }
    }
  }

  if (canUseMockFallback()) {
    return mockProducts.find((product) => product.slug === slug) || null;
  }

  return null;
}

export async function getProductById(id: string) {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const primary = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).eq("status", "published").maybeSingle();
      let data: unknown = primary.data;
      let error = primary.error;

      if (error) {
        const legacy = await supabase.from("products").select(PRODUCT_SELECT_LEGACY).eq("id", id).eq("status", "published").maybeSingle();
        data = legacy.data;
        error = legacy.error;
      }

      if (!error && data) {
        return normalizeProducts([data as ProductRecord])[0] || null;
      }
    }
  }

  if (canUseMockFallback()) {
    return mockProducts.find((product) => product.id === id) || null;
  }

  return null;
}

export async function getProductsForAdmin() {
  if (!isSupabaseConfigured()) {
    return canUseMockFallback() ? mockProducts : [];
  }

  const products = attachFamilyProducts(await getProductsFromSupabase());
  return canUseMockFallback() && products.length === 0 ? mockProducts : products;
}

export async function searchProducts(filters: ProductFilters = {}) {
  const products = await getActiveProducts();
  return filterProducts(products, filters);
}

export async function getProductOptions(): Promise<ProductOptions> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const [garments, colors, sizes, categories, collections] = await Promise.all([
        supabase.from("garment_types").select("id, code, name").order("name"),
        supabase.from("colors").select("id, code, name, hex").order("name"),
        supabase.from("sizes").select("id, code, name, sort_order").order("sort_order"),
        supabase.from("categories").select("id, slug, name").order("sort_order"),
        supabase.from("collections").select("id, slug, name").eq("is_active", true).order("sort_order")
      ]);

      if (!garments.error && !colors.error && !sizes.error) {
        return {
          garmentTypes: (garments.data || []).map((item) => ({ id: item.id, code: item.code, name: item.name })),
          colors: (colors.data || []).map((item) => ({ id: item.id, code: item.code, name: item.name, hex: item.hex })),
          sizes: (sizes.data || []).map((item) => ({ id: item.id, code: item.code, name: item.name, sortOrder: item.sort_order })),
          categories: categories.error ? [] : (categories.data || []).map((item) => ({ id: item.id, code: item.slug, name: item.name })),
          collections: collections.error ? [] : (collections.data || []).map((item) => ({ id: item.id, code: item.slug, name: item.name }))
        };
      }
    }
  }

  if (!canUseMockFallback()) {
    return {
      garmentTypes: [],
      colors: [],
      sizes: [],
      categories: [],
      collections: []
    };
  }

  return {
    garmentTypes: [
      { id: "mock-rem", code: "REM", name: "Remera" },
      { id: "mock-buz", code: "BUZ", name: "Buzo" },
      { id: "mock-mus", code: "MUS", name: "Musculosa" }
    ],
    colors: roxLisaColors.map((color) => ({ id: `mock-${color.code}`, code: color.code, name: color.label, hex: color.hex })),
    sizes: roxSizes.map((size, index) => ({ id: `mock-${size}`, code: size, name: size, sortOrder: index + 1 })),
    categories: [
      { id: "mock-rem", code: "remeras", name: "Remeras" },
      { id: "mock-buz", code: "buzos", name: "Buzos" }
    ],
    collections: [{ id: "mock-drop", code: "drop-01", name: "Drop 01" }]
  };
}

export function getMockFallbackEnabled() {
  return canUseMockFallback();
}
