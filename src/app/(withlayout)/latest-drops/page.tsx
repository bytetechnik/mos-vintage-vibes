'use client'

import { Filter } from 'lucide-react';

import ProductCard from '@/components/shared/ProductCard';
import SplashScreen from '@/components/SplashScreen';
import { Button } from '@/components/ui/button';
import { useLatestProductsQuery } from '@/redux/api/product/productApi';

const LatestDrops = () => {
  const { data, isLoading, error } = useLatestProductsQuery({});
  const latestProducts = data?.data ? (Array.isArray(data.data) ? data.data : data.data.data || []) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          Latest Drops
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Fresh arrivals from the most recent drops
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-3 md:gap-6">
        <div className="flex-1 w-full min-w-0">
          {isLoading ? (
            <SplashScreen />
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500">Error loading products</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : latestProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                No products available at the moment
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 p-8">
              {latestProducts.map((product: any, idx: number) => (
                <ProductCard key={`${product.id}-${idx}`} product={product} imageIndex={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestDrops;