// Update this page (the content is just a fallback if you fail to update the page)

import HeroSlider from '@/components/HeroSlider';
import FeaturedProducts from '@/components/FeaturedProducts';
import BrandSlider from '@/components/BrandSlider';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <FeaturedProducts />
      <BrandSlider />
    </div>
  );
};

export default Index;
