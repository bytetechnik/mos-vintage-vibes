'use client';
import { useCategoriesQuery } from '@/redux/api/categoriesApi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const KollectionSlider = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useCategoriesQuery({});
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

  // Filter only active categories and sort by sortOrder
  const activeCategories = data?.data
    ?.filter((category: any) => category.isActive)
    ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder) || [];

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-slide functionality
  useEffect(() => {
    if (!api || activeCategories.length === 0) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [api, activeCategories.length]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 tracking-wide">KOLLEKTIONEN</h2>
          </div>
          <div className="flex justify-center items-center h-[500px]">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data?.success) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 tracking-wide">KOLLEKTIONEN</h2>
          </div>
          <div className="flex justify-center items-center h-[500px]">
            <p className="text-red-500">Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (activeCategories.length === 0) {
    return (
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 tracking-wide">KOLLEKTIONEN</h2>
          </div>
          <div className="flex justify-center items-center h-[500px]">
            <p className="text-gray-500">No active categories available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 tracking-wide">KOLLEKTIONEN</h2>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {activeCategories.map((category: any, index: number) => (
                <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                  <div className="relative group h-[500px] md:h-[600px] cursor-pointer overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      width={400}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <h3 className="text-white text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-wider text-center px-4">
                        {category.name.toUpperCase()}
                      </h3>
                      {category.description && (
                        <p className="text-white text-sm md:text-base mb-4 px-4 text-center opacity-90">
                          {category.description}
                        </p>
                      )}
                      <button
                        onClick={() => router.push(`/products?category=${category.id}`)}
                        className="px-6 md:px-8 py-2 border-2 border-white text-white text-lg md:text-xl font-semibold rounded-full bg-transparent hover:bg-white hover:text-black transition-colors duration-300"
                      >
                        SHOP NOW
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 md:left-4" />
            <CarouselNext className="right-2 md:right-4" />
          </Carousel>

          {/* Dots navigation */}
          <div className="flex justify-center mt-6 space-x-2">
            {activeCategories.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === current ? 'bg-vintage-orange' : 'bg-gray-300'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KollectionSlider;