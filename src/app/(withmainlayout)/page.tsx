import BrandSlider from "@/components/home/BrandSlider";
import FAQSection from "@/components/home/FAQSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSlider from "@/components/home/HeroSlider";
import KollectionSlider from "@/components/home/KollectionSlider";
import LatestDrops from "@/components/home/LatestDrops";
import ReviewSection from "@/components/home/ReviewSection";


export default function Home() {
  return (
    <>
      <HeroSlider />
      <LatestDrops />
      <FeaturedProducts />
      <KollectionSlider />
      <FAQSection />
      <ReviewSection />
      <BrandSlider />
    </>
  );
}
