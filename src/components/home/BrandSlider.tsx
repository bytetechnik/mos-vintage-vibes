'use client';
import { useBrandsQuery } from '@/redux/api/brandsApi';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const BrandSlider = () => {
  const { data, isLoading, isError } = useBrandsQuery({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter only active brands and sort by sortOrder (nulls last)
  const activeBrands = data?.data
    ?.filter((brand: any) => brand.isActive)
    ?.sort((a: any, b: any) => {
      // Handle null sortOrder values
      if (a.sortOrder === null) return 1;
      if (b.sortOrder === null) return -1;
      return a.sortOrder - b.sortOrder;
    }) || [];

  useEffect(() => {
    if (activeBrands.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBrands.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [activeBrands.length]);

  if (isLoading) {
    return (
      <section className="py-8 sm:py-16 bg-warm-beige">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              Featured Brands
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground">
              Authentic pieces from the world&apos;s most iconic streetwear brands
            </p>
          </div>
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">Loading brands...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="py-8 sm:py-16 bg-warm-beige">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              Featured Brands
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground">
              Authentic pieces from the world&apos;s most iconic streetwear brands
            </p>
          </div>
          <div className="flex justify-center items-center h-32">
            <p className="text-red-500">Failed to load brands. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (activeBrands.length === 0) {
    return (
      <section className="py-8 sm:py-16 bg-warm-beige">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-4">
              Featured Brands
            </h2>
            <p className="text-xs sm:text-base text-muted-foreground">
              Authentic pieces from the world&apos;s most iconic streetwear brands
            </p>
          </div>
          <div className="flex justify-center items-center h-32">
            <p className="text-muted-foreground">No active brands available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-16 bg-warm-beige">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-4">
            Featured Brands
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground">
            Authentic pieces from the world&apos;s most iconic streetwear brands
          </p>
        </div>

        {/* Desktop view - all brands visible */}
        <div className="hidden md:flex items-center justify-center flex-wrap gap-6 sm:gap-12 overflow-hidden py-4">
          {activeBrands.map((brand: any) => (
            <div
              key={brand.id}
              className="flex items-center justify-center w-32 h-20 bg-white rounded-lg shadow-card-custom hover:shadow-hover-street transition-shadow duration-300 cursor-pointer p-4"
              title={brand.name}
            >
              <Image
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                width={200}
                height={100}
                className="object-contain w-full h-full transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
          ))}
        </div>

        {/* Mobile view - sliding brands */}
        <div className="md:hidden">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-32 h-16 sm:w-40 sm:h-24 bg-white rounded-lg shadow-card-custom p-2 sm:p-4">
              <Image
                src={activeBrands[currentIndex].logoUrl}
                alt={`${activeBrands[currentIndex].name} logo`}
                width={200}
                height={100}
                className="object-contain w-full h-full"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>
          </div>

          {/* Brand name */}
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-foreground">
              {activeBrands[currentIndex].name}
            </p>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-4">
            {activeBrands.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-vintage-orange' : 'bg-muted-foreground/40'
                  }`}
                aria-label={`Go to brand ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;