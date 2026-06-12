import { GenderFilteredDrop } from "@/components/home/GenderFilteredDrop";
import { HeroCampaign } from "@/components/home/HeroCampaign";
import { OrderTimeline } from "@/components/home/OrderTimeline";
import { PrintWallMarquee } from "@/components/home/PrintWallMarquee";
import { RandomPrintTeaser } from "@/components/home/RandomPrintTeaser";
import { getActiveProducts, getFeaturedProducts } from "@/lib/products/queries";
import { getSiteSettings } from "@/lib/settings/getSiteSettings";
import { buildWhatsAppUrl } from "@/lib/whatsapp/buildWhatsAppUrl";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, randomProducts, settings] = await Promise.all([getFeaturedProducts(), getActiveProducts(), getSiteSettings()]);
  const whatsappUrl = buildWhatsAppUrl({
    phone: settings.whatsappEnabled ? settings.whatsappNumber : null,
    message: "Hola ROXWANA, quiero ver el drop y consultar disponibilidad."
  });

  return (
    <>
      <HeroCampaign whatsappUrl={whatsappUrl} />
      <GenderFilteredDrop products={featuredProducts} />
      <PrintWallMarquee products={randomProducts} />
      <RandomPrintTeaser products={randomProducts} />
      <OrderTimeline />
    </>
  );
}
