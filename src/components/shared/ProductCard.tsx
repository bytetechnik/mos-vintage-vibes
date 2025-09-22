
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';

interface ProductCardProps {
  product: Product;
  imageIndex?: number;
}

const ProductCard = memo(({ product, imageIndex = 0 }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // const handleAddToCart = useCallback((e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   addItem(product, 1);
  // }, [addItem, product]);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  }, [isLiked]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const getConditionBadge = (rating: number) => {
    if (rating === 10) return { text: 'New', variant: 'default' as const };
    if (rating >= 9) return { text: 'Like New', variant: 'secondary' as const };
    if (rating >= 8) return { text: 'Excellent', variant: 'outline' as const };
    return { text: 'Good', variant: 'outline' as const };
  };

  const condition = getConditionBadge(product.condition.rating);

  return (
    <Link href={`/products/${product.id}`} className="block w-full">
      <div className="group bg-card md:bg-card rounded-lg overflow-hidden shadow-card-custom md:shadow-card-custom hover:shadow-hover-street md:hover:shadow-hover-street transition-all duration-300 hover:scale-105 md:hover:scale-105 w-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <Image
            src={product.images[imageIndex % product.images.length]}
            alt={product.name}
            fill
            priority
            className={`object-cover group-hover:scale-110 md:group-hover:scale-110 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />


          {imageError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">Image not available</span>
            </div>
          )}
          {/* Sold Out Badge */}
          {!product.inStock && (
            <div className="absolute top-2 right-2 z-20">
              <Badge variant="secondary" className="bg-gray-800 text-white opacity-90 text-xs px-2 md:px-3 py-1 rounded-full">
                AUSVERKAUFT
              </Badge>
            </div>
          )}
          {/* Overlay actions */}
          {product.inStock && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
              <Button
                variant="vintage"
                size="icon"
                // onClick={handleAddToCart}
                className="rounded-full"
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
          )}

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
        <div className="p-2 md:p-2">
          <div className="mb-1">
            <h3 className="font-semibold md:font-semibold text-foreground md:text-foreground group-hover:text-vintage-orange md:group-hover:text-vintage-orange transition-colors line-clamp-2 text-xs md:text-sm">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground hidden md:block">{product.brand}</p>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1">
              <span className="text-xs md:text-sm font-bold md:font-bold text-foreground md:text-foreground">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through hidden md:inline">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {product.size}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="hidden md:inline">{product.condition.rating}/10</span>
            <span className="text-right hidden md:inline">{product.color}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;