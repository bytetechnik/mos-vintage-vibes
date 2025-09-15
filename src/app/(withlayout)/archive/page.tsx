
'use client';
import ProductCard from '@/components/shared/ProductCard';
import { products } from '@/data/products';

const Archive = () => {
  return (
    <div className="container mx-auto px-8 sm:px-12 lg:px-16 py-6 max-w-full mt-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Archiv</h1>
        <p className="text-muted-foreground">Alle Produkte im Archiv</p>
      </div>
      <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={{ ...product, inStock: false }} imageIndex={idx} />
        ))}
      </div>
    </div>
  );
};

export default Archive; 