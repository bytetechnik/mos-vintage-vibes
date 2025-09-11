import HeroSlider from "@/components/home/HeroSlider";
import LatestDrops from "@/components/home/LatestDrops";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";


export default function Home() {
  return (
    <>
      <Header />
      <HeroSlider />
      <LatestDrops />
      <Footer />
    </>
  );
}
