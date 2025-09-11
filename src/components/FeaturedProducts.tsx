import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';
import ProductCard from './shared/ProductCard';

const FeaturedProducts = () => {
  const featuredProducts = products.filter(product => product.featured).slice(0, 6);

  return (
    <section className="py-8 sm:py-16 px-2 sm:px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Top Products
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked collection of the finest vintage streetwear pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {featuredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} imageIndex={idx} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/products">
            <Button variant="street" size="lg">
              See More Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;