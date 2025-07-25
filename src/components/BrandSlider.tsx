import { useState, useEffect } from 'react';
import { brands } from '@/data/products';
import nikeLogo from '@/assets/brands/nike-logo.png';
import adidasLogo from '@/assets/brands/adidas-logo.png';
import supremeLogo from '@/assets/brands/supreme-logo.png';
import offWhiteLogo from '@/assets/brands/off-white-logo.png';
import stoneIslandLogo from '@/assets/brands/stone-island-logo.png';
import carhartLogo from '@/assets/brands/carhartt-logo.png';

const BrandSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const brandLogos = {
    'Nike': nikeLogo,
    'Adidas': adidasLogo,
    'Supreme': supremeLogo,
    'Off-White': offWhiteLogo,
    'Stone Island': stoneIslandLogo,
    'Carhartt': carhartLogo,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 sm:py-16 bg-warm-beige">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-4">
            Featured Brands
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Authentic pieces from the world's most iconic streetwear brands
          </p>
        </div>

        {/* Desktop view - all brands visible */}
        <div className="hidden md:flex items-center justify-center space-x-6 sm:space-x-12">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center w-32 h-20 bg-white rounded-lg shadow-card-custom hover:shadow-hover-street transition-all duration-300 hover:scale-110 cursor-pointer p-4"
            >
              <img 
                src={brandLogos[brand.name as keyof typeof brandLogos]} 
                alt={`${brand.name} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Mobile view - sliding brands */}
        <div className="md:hidden">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-32 h-16 sm:w-40 sm:h-24 bg-white rounded-lg shadow-card-custom p-2 sm:p-4">
              <img 
                src={brandLogos[brands[currentIndex].name as keyof typeof brandLogos]} 
                alt={`${brands[currentIndex].name} logo`}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-4">
            {brands.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-vintage-orange' : 'bg-muted-foreground/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;