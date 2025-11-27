import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
// import { useAddToCartMutation } from '@/redux/api/cartApi';
import { useAddToWishListMutation } from '@/redux/api/wishListApi';
import { Product } from '@/types/product';
import { isAuthenticated, saveIntendedAction } from '@/utils/auth-helpers';
import { Heart, Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useState } from 'react';

interface ProductCardProps {
  product: Product;
  imageIndex?: number;
}

const ProductCard = memo(({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // const [addToCart, { isLoading: isAddingToCart, isSuccess: isCartSuccess, error: cartError, reset: resetCart }] = useAddToCartMutation();
  const [addToWishList, { isLoading: isAddingToWishList, isSuccess: isWishListSuccess, error: wishListError, reset: resetWishList }] = useAddToWishListMutation();

  // Handle add to cart success
  // useEffect(() => {
  //   if (isCartSuccess) {
  //     toast({
  //       title: 'Added to Cart',
  //       description: `${product.name} has been added to your cart.`,
  //       variant: 'success',
  //     });
  //     resetCart();
  //   }
  // }, [isCartSuccess, product.name, toast, resetCart]);

  // Handle add to cart error
  // useEffect(() => {
  //   if (cartError) {
  //     toast({
  //       title: 'Error',
  //       description: 'Failed to add item to cart',
  //       variant: 'destructive',
  //     });
  //     resetCart();
  //   }
  // }, [cartError, toast, resetCart]);

  // Handle add to wishlist success
  useEffect(() => {
    if (isWishListSuccess) {
      setIsLiked(true);
      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
        variant: 'success',
      });
      resetWishList();
    }
  }, [isWishListSuccess, product.name, toast, resetWishList]);

  // Handle add to wishlist error
  useEffect(() => {
    if (wishListError) {
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist',
        variant: 'destructive',
      });
      resetWishList();
    }
  }, [wishListError, toast, resetWishList]);

  // const handleAddToCart = useCallback((e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   // Check authentication
  //   if (!isAuthenticated()) {
  //     // Get first available variant
  //     const firstAvailableVariant = product.variants?.find(v => v.stockQuantity > 0);

  //     if (firstAvailableVariant) {
  //       // Save the intended action
  //       saveIntendedAction({
  //         type: 'add-to-cart',
  //         productId: product.id as string,
  //         variantId: firstAvailableVariant.id,
  //         quantity: 1,
  //       });
  //     }

  //     toast({
  //       title: 'Login Required',
  //       description: 'Redirecting to login...',
  //       variant: 'default',
  //     });

  //     // Redirect to login
  //     setTimeout(() => {
  //       router.push('/login');
  //     }, 500);
  //     return;
  //   }

  //   if (!product.inStock) {
  //     toast({
  //       title: 'Out of Stock',
  //       description: 'This item is currently out of stock.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   if (!product.variants || product.variants.length === 0) {
  //     toast({
  //       title: 'No Variants Available',
  //       description: 'Please view the product details to select a size.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   // Get first available variant
  //   const firstAvailableVariant = product.variants.find(v => v.stockQuantity > 0);

  //   if (!firstAvailableVariant) {
  //     toast({
  //       title: 'Out of Stock',
  //       description: 'All sizes are currently out of stock.',
  //       variant: 'destructive',
  //     });
  //     return;
  //   }

  //   // Normal add to cart logic
  //   addToCart({
  //     productId: product.id,
  //     variantId: firstAvailableVariant.id,
  //     quantity: 1,
  //     currency: 'EUR',
  //   });
  // }, [product, addToCart, toast, router]);

  const handleLike = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check authentication
    if (!isAuthenticated()) {
      // Save the intended action
      saveIntendedAction({
        type: 'add-to-wishlist',
        productId: product.id as string,
      });

      toast({
        title: 'Login Required',
        description: 'Redirecting to login...',
        variant: 'default',
      });

      // Redirect to login
      setTimeout(() => {
        router.push('/login');
      }, 500);
      return;
    }

    if (isLiked) {
      toast({
        title: 'Already in Wishlist',
        description: 'This item is already in your wishlist.',
        variant: 'default',
      });
      return;
    }

    // Normal wishlist logic
    addToWishList({
      productId: product.id
    });
  }, [isLiked, product.id, addToWishList, toast, router]);
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const getConditionBadge = (rating: number) => {
    if (rating === 10) return { text: 'New', variant: 'default' as const };
    if (rating >= 9) return { text: 'Like New', variant: 'secondary' as const };
    if (rating >= 8) return { text: 'Excellent', variant: 'outline' as const };
    return { text: 'Good', variant: 'outline' as const };
  };

  const condition = getConditionBadge(product?.conditionRating || 0);
  const hasDiscount = product.basePrice > product.sellingPrice;

  return (
    <Link href={`/products/${product.id}`} className="block w-full">
      <div className="group relative z-10 hover:z-20 bg-card md:bg-card rounded-lg overflow-hidden shadow-card md:shadow-card hover:shadow-street md:hover:shadow-street transition-all duration-300 hover:scale-105 md:hover:scale-105 w-full">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <Image
            src={product.image || '/placeholder.png'}
            alt={product?.name}
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
                // disabled={isAddingToCart}
                className="rounded-full"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />

                {/* {isAddingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )} */}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                disabled={isAddingToWishList}
                className="rounded-full text-white hover:bg-white/20"
                aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isAddingToWishList ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                )}
              </Button>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            <Badge variant={condition.variant} className="text-xs">
              {condition.text}
            </Badge>
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                {Math.round(((product.basePrice - product.sellingPrice) / product.basePrice) * 100)}% OFF
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
            <p className="text-xs text-muted-foreground hidden md:block">{product.brandName}</p>
          </div>

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-1">
              <span className="text-xs md:text-sm font-bold md:font-bold text-foreground md:text-foreground">
                €{product?.sellingPrice?.toFixed(2)}
              </span>
              {product.basePrice && hasDiscount && (
                <span className="text-xs text-muted-foreground line-through hidden md:inline">
                  €{product?.basePrice?.toFixed(2)}
                </span>
              )}
            </div>
          </div>


        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;