import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { GenderGateway } from "@/components/home/GenderGateway";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HowToOrder } from "@/components/home/HowToOrder";
import { KineticPrintWall } from "@/components/home/KineticPrintWall";
import { RandomPrintTeaser } from "@/components/home/RandomPrintTeaser";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <GenderGateway />
      <FeaturedProducts />
      <KineticPrintWall />
      <RandomPrintTeaser />
      <HowToOrder />
    </>
  );
}
