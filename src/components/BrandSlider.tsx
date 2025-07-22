import { useState, useEffect } from 'react';
import { brands } from '@/data/products';

const BrandSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % brands.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-warm-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Featured Brands
          </h2>
          <p className="text-muted-foreground">
            Authentic pieces from the world's most iconic streetwear brands
          </p>
        </div>

        {/* Desktop view - all brands visible */}
        <div className="hidden md:flex items-center justify-center space-x-12">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex items-center justify-center w-32 h-20 bg-white rounded-lg shadow-card-custom hover:shadow-hover-street transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <span className="font-bold text-xl text-street-black">{brand.name}</span>
            </div>
          ))}
        </div>

        {/* Mobile view - sliding brands */}
        <div className="md:hidden">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-40 h-24 bg-white rounded-lg shadow-card-custom">
              <span className="font-bold text-xl text-street-black">
                {brands[currentIndex].name}
              </span>
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