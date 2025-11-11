'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAddToCartMutation } from '@/redux/api/cartApi';
import { useProductQuery, useRelatedProductsQuery } from '@/redux/api/product/productApi';
import { Product, ProductVariant } from '@/types/product';
import { ArrowLeft, Eye, Heart, Loader2, RotateCcw, Shield, ShoppingBag, ShoppingCart, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const ProductCard = ({ product }: { product: Product }) => (
  <Link href={`/products/${product.id}`} className="block group">
    <div className="border rounded-lg p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-md">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-amber-500">Featured</Badge>
        )}
      </div>
      <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-muted-foreground text-sm mb-2">{product.brandName}</p>
      <div className="flex items-center space-x-2">
        <p className="font-bold text-lg">€{product.sellingPrice.toFixed(2)}</p>
        {product.basePrice > product.sellingPrice && (
          <p className="text-sm text-muted-foreground line-through">
            €{product.basePrice.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  </Link>
);

const ProductDetailPage = ({ params }: ProductDetailPageProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { toast } = useToast();
  const { id } = use(params);
  const { data, isLoading: isProductLoading, error: productError } = useProductQuery(id);
  const product = data?.data;

  const [addToCart, { isLoading: isAddingToCart, isSuccess, error: cartError, reset }] = useAddToCartMutation();
  const { data: relatedProducts } = useRelatedProductsQuery(id)

  useEffect(() => {
    setSelectedVariant(product ? (product.variants.length > 0 ? product.variants[0] : null) : null);
  }, [product]);

  // Handle add to cart success
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Added to Cart',
        description: `${product?.name} (${selectedVariant?.size}) has been added to your cart.`,
        variant: 'success',
      });
      reset(); // Reset mutation state
    }
  }, [isSuccess, product?.name, selectedVariant?.size, toast, reset]);

  // Handle add to cart error
  useEffect(() => {
    if (cartError) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
      reset(); // Reset mutation state
    }
  }, [cartError, toast, reset]);

  // Loading state
  if (isProductLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {productError
              ? 'An error occurred while loading the product.'
              : 'The product you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Button asChild>
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        title: 'Select a Size',
        description: 'Please select a size before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

    if (!isInStock) {
      toast({
        title: 'Out of Stock',
        description: 'This item is currently out of stock.',
        variant: 'destructive',
      });
      return;
    }

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      currency: 'EUR',
    });

  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleVariantChange = (variant: ProductVariant) => {
    if (variant.stockQuantity === 0) {
      toast({
        title: 'Out of Stock',
        description: `Size ${variant.size} is currently out of stock.`,
        variant: 'destructive',
      });
      return;
    }
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity when changing variant
  };

  const getConditionColor = (rating: number) => {
    if (rating === 10) return 'text-green-600';
    if (rating >= 9) return 'text-green-500';
    if (rating >= 8) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getConditionText = (rating: number) => {
    if (rating === 10) return 'Brand New with Tags';
    if (rating >= 9) return 'Like New - Perfect Condition';
    if (rating >= 8) return 'Excellent - Minor Wear';
    return 'Good - Some Signs of Wear';
  };

  const currentPrice = selectedVariant?.sellingPrice || product.sellingPrice;
  const originalPrice = selectedVariant?.basePrice || product.basePrice;
  const displayImage = selectedVariant?.image || product.image;
  const availableStock = selectedVariant?.stockQuantity || 0;
  const isInStock = availableStock > 0 && product.inStock;

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8 pt-16">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center text-muted-foreground hover:text-orange-500 mb-4 sm:mb-6 text-sm sm:text-base transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div
            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <Image
              src={displayImage || '/placeholder.svg'}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              style={
                isZoomed
                  ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` }
                  : {}
              }
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.conditionRating === 10 && (
                <Badge className="bg-green-600">New</Badge>
              )}
              {originalPrice > currentPrice && (
                <Badge variant="destructive">
                  {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-amber-500">Featured</Badge>
              )}
              {!isInStock && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>

            {isZoomed && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Hover to zoom
              </div>
            )}
          </div>

          {/* Thumbnail images */}
          {product?.variants?.length > 0 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product?.variants.map((variant: ProductVariant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant)}
                  disabled={variant.stockQuantity === 0}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedVariant?.id === variant.id ? 'border-orange-500' : 'border-transparent'
                    } ${variant.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Image
                    src={variant.image || '/placeholder.svg'}
                    alt={`${product.name} ${variant.size}`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground font-medium">{product.brandName}</span>
                <Badge variant="outline">{product.categoryName}</Badge>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {product.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" />
                  {product.purchaseCount} sold
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-muted-foreground mb-4">{product.shortDescription}</p>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-foreground">
                  €{currentPrice?.toFixed(2)}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    €{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {originalPrice > currentPrice && (
                <Badge variant="destructive" className="text-sm">
                  Save €{(originalPrice - currentPrice).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Condition */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.conditionRating / 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className={`font-medium ${getConditionColor(product.conditionRating)}`}>
                {product.conditionRating}/10 - {getConditionText(product.conditionRating)}
              </span>
            </div>
          </div>

          {/* Variant Selection */}
          {product?.variants?.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Size {selectedVariant && `- ${selectedVariant.material}`}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {product?.variants.map((variant: ProductVariant) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(variant)}
                      disabled={variant.stockQuantity === 0}
                      className={`
                        relative px-4 py-3 rounded-lg border-2 transition-all font-medium
                        ${selectedVariant?.id === variant.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                        ${variant.stockQuantity === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                        }
                      `}
                    >
                      {variant.size}
                      {variant.stockQuantity === 0 && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs bg-white px-2 py-1 rounded">Out</span>
                        </span>
                      )}
                      {variant.stockQuantity > 0 && variant.stockQuantity <= 3 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {variant.stockQuantity}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {selectedVariant && selectedVariant.stockQuantity > 0 && selectedVariant.stockQuantity <= 5 && (
                  <p className="text-sm text-orange-600 mt-2">
                    Only {selectedVariant.stockQuantity} left in stock!
                  </p>
                )}
              </div>

              {selectedVariant && (
                <div className="text-sm text-muted-foreground">
                  <p>SKU: {selectedVariant.sku}</p>
                  <p>Color: {selectedVariant.color}</p>
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(parseInt(value))}
              disabled={!isInStock}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(Math.min(availableStock, 5))].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={!isInStock || !selectedVariant || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {!isInStock ? 'Out of Stock' : !selectedVariant ? 'Select Size' : 'Add to Cart'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-muted-foreground">Orders over €50</div>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-sm font-medium">Authenticity</div>
              <div className="text-xs text-muted-foreground">Verified items</div>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-sm font-medium">Returns</div>
              <div className="text-xs text-muted-foreground">14 days</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              {product.metaKeywords && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.metaKeywords.split(',').map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Product Details</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Brand:</dt>
                    <dd className="font-medium">{product.brandName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category:</dt>
                    <dd className="font-medium">{product.categoryName}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Condition:</dt>
                    <dd className="font-medium">{product.conditionRating}/10</dd>
                  </div>
                  {selectedVariant && (
                    <>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Size:</dt>
                        <dd className="font-medium">{selectedVariant.size}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Color:</dt>
                        <dd className="font-medium">{selectedVariant.color}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Material:</dt>
                        <dd className="font-medium">{selectedVariant.material}</dd>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Views:</dt>
                    <dd className="font-medium">{product.viewCount.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Total Sold:</dt>
                    <dd className="font-medium">{product.purchaseCount}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-medium mb-3">Condition Details</h4>
                <p className="text-muted-foreground mb-4">
                  {getConditionText(product.conditionRating)}
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-900">
                    <strong>Authenticity Guaranteed:</strong> All items are verified for authenticity before listing.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="care" className="mt-6">
            <div className="space-y-4">
              <h4 className="font-medium">Care Instructions</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Machine wash cold with like colors</li>
                <li>• Do not bleach</li>
                <li>• Tumble dry low or hang to dry</li>
                <li>• Iron on low heat if needed</li>
                <li>• Do not dry clean unless specified</li>
              </ul>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <strong>Note:</strong> As this is a vintage/used item, please handle with extra care to maintain its condition and longevity.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct: Product) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;