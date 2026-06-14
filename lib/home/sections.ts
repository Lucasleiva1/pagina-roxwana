import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { HomeSection, HomeSectionKey } from "@/types/admin";
import type { Database } from "@/types/supabase";

type SectionRow = Database["public"]["Tables"]["site_sections"]["Row"];

export const defaultHomeSections: HomeSection[] = [
  {
    key: "hero",
    type: "hero",
    title: "ROXWANA",
    subtitle: "ESTILO URBANO",
    body: "Explora modelos, colores y talles antes de armar tu pedido.",
    imagePath: "/images/hero/hero-03.png",
    ctaLabel: "Ver catalogo",
    ctaUrl: "#drop-01",
    isVisible: true,
    sortOrder: 10,
    metadata: {}
  },
  {
    key: "featured_drop",
    type: "drop_banner",
    title: "ENTRA POR ACTITUD",
    subtitle: "Colecciones",
    body: "Dos accesos visuales al drop. Filtra los modelos abajo sin salir de esta pagina.",
    imagePath: null,
    ctaLabel: null,
    ctaUrl: null,
    isVisible: true,
    sortOrder: 20,
    metadata: {}
  },
  {
    key: "featured_products",
    type: "product_grid",
    title: "ELEGI TU MODELO",
    subtitle: null,
    body: "Grilla clara para mirar modelos, recorrer imagenes y entrar al detalle sin distracciones.",
    imagePath: null,
    ctaLabel: null,
    ctaUrl: null,
    isVisible: true,
    sortOrder: 30,
    metadata: {}
  },
  {
    key: "brand_statement",
    type: "brand_statement",
    title: "POSTERS, CALLE Y RUIDO VISUAL",
    subtitle: "Graphic wear",
    body: "La marca se mueve entre textura urbana, contraste rockero y prendas directas para uso diario.",
    imagePath: null,
    ctaLabel: null,
    ctaUrl: null,
    isVisible: true,
    sortOrder: 40,
    metadata: {}
  },
  {
    key: "how_to_order",
    type: "how_to_order",
    title: "DEL MODELO AL PEDIDO",
    subtitle: "Como ordenar",
    body: "Elegis la prenda, armas el carrito y mandas el pedido por WhatsApp con tus datos de entrega.",
    imagePath: null,
    ctaLabel: null,
    ctaUrl: null,
    isVisible: true,
    sortOrder: 50,
    metadata: {}
  },
  {
    key: "final_cta",
    type: "final_cta",
    title: "RULETA DE PRINTS",
    subtitle: "Random pick",
    body: "Deja que ROXWANA elija un modelo para arrancar el pedido.",
    imagePath: null,
    ctaLabel: "Probar suerte",
    ctaUrl: "#random-print",
    isVisible: true,
    sortOrder: 60,
    metadata: {}
  }
];

export function mapHomeSection(row: SectionRow): HomeSection {
  return {
    id: row.id,
    key: row.key as HomeSectionKey,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle,
    body: row.body,
    imagePath: row.image_path,
    ctaLabel: row.cta_label,
    ctaUrl: row.cta_url,
    isVisible: row.is_visible,
    sortOrder: row.sort_order,
    metadata: row.metadata
  };
}

export async function getHomeSections({ includeHidden = false } = {}) {
  if (!isSupabaseConfigured()) {
    return defaultHomeSections;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return defaultHomeSections;
  }

  let query = supabase.from("site_sections").select("*").order("sort_order", { ascending: true });

  if (!includeHidden) {
    query = query.eq("is_visible", true);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return defaultHomeSections.filter((section) => includeHidden || section.isVisible);
  }

  const rows = data.map(mapHomeSection);
  const byKey = new Map<HomeSectionKey, HomeSection>();

  for (const section of defaultHomeSections) {
    byKey.set(section.key, section);
  }

  for (const section of rows) {
    byKey.set(section.key, section);
  }

  return Array.from(byKey.values())
    .filter((section) => includeHidden || section.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getHomeSection(sections: HomeSection[], key: HomeSectionKey) {
  return sections.find((section) => section.key === key) || defaultHomeSections.find((section) => section.key === key) || null;
}
