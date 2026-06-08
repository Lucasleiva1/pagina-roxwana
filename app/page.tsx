import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { GenderGateway } from "@/components/home/GenderGateway";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HowToOrder } from "@/components/home/HowToOrder";
import { KineticPrintWall } from "@/components/home/KineticPrintWall";
import { RandomPrintTeaser } from "@/components/home/RandomPrintTeaser";
import { getActiveProducts, getFeaturedProducts } from "@/lib/products/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, randomProducts] = await Promise.all([getFeaturedProducts(), getActiveProducts()]);

  return (
    <>
      <HeroCarousel />
      <GenderGateway />
      <FeaturedProducts products={featuredProducts} />
      <KineticPrintWall />
      <RandomPrintTeaser products={randomProducts} />
      <HowToOrder />
    </>
  );
}
