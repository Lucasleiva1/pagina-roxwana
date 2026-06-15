import type { ReactNode } from "react";
import { GenderFilteredDrop } from "@/components/home/GenderFilteredDrop";
import { HeroCampaign } from "@/components/home/HeroCampaign";
import { OrderTimeline } from "@/components/home/OrderTimeline";
import { PrintWallMarquee } from "@/components/home/PrintWallMarquee";
import { RandomPrintTeaser } from "@/components/home/RandomPrintTeaser";
import { getHomeSection, getHomeSections } from "@/lib/home/sections";
import { getActiveProducts } from "@/lib/products/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, sections] = await Promise.all([getActiveProducts(), getHomeSections()]);
  const dropSection = getHomeSection(sections, "featured_drop");
  const productsSection = getHomeSection(sections, "featured_products");
  const rendered: ReactNode[] = [];
  let productBlockRendered = false;

  for (const section of sections) {
    if (section.key === "hero") {
      rendered.push(<HeroCampaign key={section.key} section={section} />);
    }

    if ((section.key === "featured_drop" || section.key === "featured_products") && !productBlockRendered) {
      productBlockRendered = true;
      rendered.push(<GenderFilteredDrop key="featured-products" products={products} dropSection={dropSection} productsSection={productsSection} />);
    }

    if (section.key === "brand_statement") {
      rendered.push(<PrintWallMarquee key={section.key} products={products} />);
    }

    if (section.key === "final_cta") {
      rendered.push(<RandomPrintTeaser key={section.key} products={products} section={section} />);
    }

    if (section.key === "how_to_order") {
      rendered.push(<OrderTimeline key={section.key} section={section} />);
    }
  }

  return <>{rendered}</>;
}
