import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { toast } from 'sonner';

interface LatestDropCardProps {
  product: Product;
  imageIndex?: number;
}

const LatestDropCard = ({ product, imageIndex = 0 }: LatestDropCardProps) => {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add cart animation
    const button = e.currentTarget as HTMLElement;
    button.classList.add('animate-bounce');
    setTimeout(() => button.classList.remove('animate-bounce'), 600);
    
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const getConditionBadge = (rating: number) => {
    if (rating === 10) return { text: 'New', variant: 'default' as const };
    if (rating >= 9) return { text: 'Like New', variant: 'secondary' as const };
    if (rating >= 8) return { text: 'Excellent', variant: 'outline' as const };
    return { text: 'Good', variant: 'outline' as const };
  };

  const condition = getConditionBadge(product.condition.rating);

  return (
    <Link to={`/product/${product.id}`}>
      <div className="group bg-card rounded-lg overflow-hidden shadow-card-custom hover:shadow-hover-street transition-all duration-300 hover:scale-105 flex-shrink-0 w-64">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[imageIndex % product.images.length]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button
              variant="vintage"
              size="icon"
              onClick={handleAddToCart}
              className="rounded-full transform transition-transform duration-200 hover:scale-110"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className="rounded-full text-white hover:bg-white/20"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            <Badge variant={condition.variant} className="text-xs">
              {condition.text}
            </Badge>
            {product.originalPrice && (
              <Badge variant="destructive" className="text-xs">
                Sale
              </Badge>
            )}
            {product.featured && (
              <Badge className="text-xs bg-neon-accent">
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="mb-2">
            <h3 className="font-semibold text-sm text-foreground group-hover:text-vintage-orange transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-bold text-foreground">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.size}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{product.condition.rating}/10</span>
            <span className="text-right">{product.color}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LatestDrops = () => {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get latest products (most recent based on createdAt)
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12);

  // Duplicate products for infinite scroll
  const infiniteProducts = [...latestProducts, ...latestProducts];

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused) return;

    const scroll = () => {
      container.scrollLeft += 1;
      
      // Reset scroll position when reached halfway point
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
    };

    const interval = setInterval(scroll, 20);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-background to-warm-beige/30">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Latest Drops
          </h2>
          <p className="text-lg text-muted-foreground">
            Fresh arrivals hitting the streets right now
          </p>
        </div>

        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-hidden"
            style={{ scrollBehavior: 'auto' }}
          >
            {infiniteProducts.map((product, idx) => (
              <LatestDropCard 
                key={`${product.id}-${idx}`} 
                product={product} 
                imageIndex={idx} 
              />
            ))}
          </div>
          
          {/* Gradient fade edges */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Hover to pause • Scroll automatically
          </p>
        </div>
      </div>
    </section>
  );
};

export default LatestDrops;