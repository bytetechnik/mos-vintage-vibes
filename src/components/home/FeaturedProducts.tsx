'use client';
import { Button } from '@/components/ui/button';
import { useFeatureProductsQuery } from '@/redux/api/product/productApi';
import { Product } from '@/types/product';
import Link from 'next/link';
import ProductCard from '../shared/ProductCard';


const FeaturedProducts = () => {
  const { data: products } = useFeatureProductsQuery({});

  const featuredProducts = products?.data?.slice(0, 6) ?? [];


  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="text-center mb-2 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Top Products
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked collection of the finest vintage streetwear pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-2 sm:mb-4 py-8">
          {featuredProducts.map((product: Product, idx: number) => (
            <ProductCard key={product.id} product={product} imageIndex={idx} />
          ))}
        </div>


      </div>
      <div className="text-center">
        <Link href="/products">
          <Button variant="street" size="lg">
            See More Products
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;