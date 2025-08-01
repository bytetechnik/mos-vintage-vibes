import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface VirtualProductListProps {
  products: Product[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}

const VirtualProductList = ({
  products,
  itemHeight = 400, // Approximate height of ProductCard
  containerHeight = 600,
  overscan = 5,
  className = ''
}: VirtualProductListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      products.length
    );
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, products.length]);

  // Get visible products
  const visibleProducts = useMemo(() => {
    return products.slice(visibleRange.start, visibleRange.end);
  }, [products, visibleRange]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Calculate total height
  const totalHeight = products.length * itemHeight;

  // Calculate offset for visible items
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: offsetY,
            left: 0,
            right: 0
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                imageIndex={visibleRange.start + index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualProductList; 