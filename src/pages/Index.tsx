// Update this page (the content is just a fallback if you fail to update the page)

import HeroSlider from '@/components/HeroSlider';
import LatestDrops from '@/components/LatestDrops';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandSlider from '@/components/BrandSlider';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <LatestDrops />
      <FeaturedProducts />
      <BrandSlider />
    </div>
  );
};

export default Index;
