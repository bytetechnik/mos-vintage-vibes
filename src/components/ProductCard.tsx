import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  imageIndex?: number;
}

const ProductCard = ({ product, imageIndex = 0 }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
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
      <div className="group bg-card rounded-lg overflow-hidden shadow-card-custom hover:shadow-hover-street transition-all duration-300 hover:scale-105">
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
        <div className="p-2 sm:p-4">
          <div className="mb-1 sm:mb-2">
            <h3 className="font-semibold text-foreground group-hover:text-vintage-orange transition-colors line-clamp-2 text-base sm:text-lg">
              {product.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base sm:text-lg font-bold text-foreground">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Size: {product.size}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Condition: {product.condition.rating}/10</span>
            <span className="text-right">{product.color}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;