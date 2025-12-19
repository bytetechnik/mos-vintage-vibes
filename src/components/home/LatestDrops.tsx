"use client";
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useLatestProductsQuery } from '@/redux/api/product/productApi';
import ProductCard from '../shared/ProductCard';

const LatestDrops = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const scrollStartX = useRef<number>(0);

  const { data: latestProductsData } = useLatestProductsQuery({});

  const latestProducts = latestProductsData?.data ?? [];


  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isHovered && !isTouching) {
        scrollPosition += scrollSpeed;
        const maxScroll = scrollContainer.scrollWidth / 2;

        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered, isTouching]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    scrollStartX.current = scrollRef.current?.scrollLeft || 0;
    setIsTouching(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isTouching) return;

    const touch = e.touches[0];
    const deltaX = touchStartX.current - touch.clientX;
    const deltaY = touchStartY.current - touch.clientY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollStartX.current + deltaX;
      }
    }
  }, [isTouching]);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => {
      setIsTouching(false);
    }, 500);
  }, []);

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            LATEST DROPS
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh arrivals from the most recent drops
          </p>
        </div>

        <div
          ref={scrollRef}
          className="relative overflow-hidden touch-pan-x p-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex space-x-4 sm:space-x-6 transition-transform duration-300 select-none scroll-smooth p-4">
            {latestProducts.map((product: any, index: any) => (
              <div
                key={`${product.id}-${index}`}
                className="shrink-0 w-48 sm:w-56 md:w-64 transform hover:scale-105 transition-transform duration-300"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/latest-drops">
          <Button variant="street" size="lg">
            View All Latest Drops
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default LatestDrops;