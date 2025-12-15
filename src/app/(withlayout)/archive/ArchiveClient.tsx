'use client';
import ProductCard from '@/components/shared/ProductCard';
import { useProductsQuery } from '@/redux/api/product/productApi';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const Archive = () => {
  const searchParams = useSearchParams();

  // Get pagination parameters from URL
  const page = parseInt(searchParams.get('page') || '0');
  const perPage = parseInt(searchParams.get('perPage') || '20');

  const apiParams = useMemo(() => {
    return {
      page,
      perPage,
      in_stock: false,
    };
  }, [page, perPage]);

  // Fetch data with dynamic parameters
  const { data, isLoading, error } = useProductsQuery(apiParams);
  const products = data?.data?.data || [];

  return (
    <div className="container mx-auto px-8 sm:px-12 lg:p-16 p-6 max-w-full mt-12">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Archiv</h1>
        <p className="text-muted-foreground">Alle archivierten Produkte (Nicht vorrätig)</p>
      </div>


      {isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lädt Produkte...</p>
        </div>
      )}

      {Boolean(error) && (
        <div className="text-center py-12">
          <p className="text-red-500">Fehler beim Laden der Produkte</p>
        </div>
      )}


      {!isLoading && !error && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Keine archivierten Produkte gefunden</p>
        </div>
      )}


      {!isLoading && !error && products.length > 0 && (
        <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 p-6">
          {products.map((product: any, idx: number) => (
            <ProductCard
              key={product.id}
              product={product}
              imageIndex={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;