'use client';
import jackenImg from '@/assets/categoryicon/Jacken.avif';
import pulloverImg from '@/assets/categoryicon/Pullover.avif';
import anzugeImg from '@/assets/categoryicon/anzuge.avif';
import designerImg from '@/assets/categoryicon/designer.avif';
import jeansImg from '@/assets/categoryicon/jeans.avif';
import joggerImg from '@/assets/categoryicon/jogger.avif';
import shirtsImg from '@/assets/categoryicon/shirts.avif';
import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const categoryData = [
  {
    key: 'trackpants-joggers',
    label: 'JOGGERS',
    icon: joggerImg,
    description: 'Trackpants & Joggers',
  },
  {
    key: 'shirts-polos',
    label: 'SHIRTS',
    icon: shirtsImg,
    description: 'Shirts & Polos',
  },
  {
    key: 'jackets',
    label: 'JACKETS',
    icon: jackenImg,
    description: 'Jackets',
  },
  {
    key: 'jeans',
    label: 'JEANS',
    icon: jeansImg,
    description: 'Jeans',
  },
  {
    key: 'tracksuits',
    label: 'ANZÜGE',
    icon: anzugeImg,
    description: 'Tracksuits',
  },
  {
    key: 'accessories',
    label: 'DESIGNER',
    icon: designerImg,
    description: 'Accessories',
  },
  {
    key: 'sweaters-hoodies',
    label: 'PULLOVER',
    icon: pulloverImg,
    description: 'Sweaters & Hoodies',
  },
];

const KollectionSlider = () => {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);

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
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

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
              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              {categoryData.map((cat, index) => (
                <CarouselItem key={cat.key} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                  <div className="relative group h-[500px] md:h-[600px] cursor-pointer overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={cat.icon}
                      alt={cat.label}
                      width={400} // Set appropriate width based on your container
                      height={300} // Set appropriate height based on your container
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <h3 className="text-white text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-wider text-center">
                        {cat.label}
                      </h3>
                      <button
                        onClick={() => router.push(`/products?category=${cat.key}`)}
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
            {categoryData.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === current ? 'bg-vintage-orange' : 'bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KollectionSlider; 