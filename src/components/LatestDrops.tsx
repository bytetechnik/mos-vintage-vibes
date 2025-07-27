import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { products } from '@/data/products';

const LatestDrops = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const scrollStartX = useRef<number>(0);

  // Get the latest products (sorted by createdAt date, most recent first)
  const latestProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6); // Show 6 latest products for better mobile experience

  // Duplicate products for infinite scroll effect
  const duplicatedProducts = [...latestProducts, ...latestProducts];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame - slower for better UX

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

  // Touch event handlers
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
    
    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollStartX.current + deltaX;
      }
    }
  }, [isTouching]);

  const handleTouchEnd = useCallback(() => {
    // Add a small delay before resuming auto-scroll
    setTimeout(() => {
      setIsTouching(false);
    }, 500);
  }, []);

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            LATEST DROPS
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh arrivals from the most recent drops
          </p>
        </div>

        {/* Infinite Slider Container */}
        <div 
          ref={scrollRef}
          className="relative overflow-hidden touch-pan-x"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex space-x-4 sm:space-x-6 transition-transform duration-300 select-none scroll-smooth">
            {duplicatedProducts.map((product, index) => (
              <div 
                key={`${product.id}-${index}`} 
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 transform hover:scale-105 transition-transform duration-300"
              >
                <ProductCard product={product} imageIndex={index % product.images.length} />
              </div>
            ))}
          </div>
          
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link to="/latest-drops">
            <Button variant="street" size="lg">
              View All Latest Drops
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestDrops; 