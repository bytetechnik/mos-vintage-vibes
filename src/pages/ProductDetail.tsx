import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/products">
          <Button variant="street">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSize || product.size);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
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

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-vintage-orange mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image with zoom */}
          <div 
            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    }
                  : {}
              }
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.condition.rating === 10 && (
                <Badge className="bg-green-600">New</Badge>
              )}
              {product.originalPrice && (
                <Badge variant="destructive">Sale</Badge>
              )}
              {product.featured && (
                <Badge className="bg-neon-accent">Featured</Badge>
              )}
            </div>

            {/* Zoom indicator */}
            {isZoomed && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Hover to zoom
              </div>
            )}
          </div>

          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-vintage-orange' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
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
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-muted-foreground">{product.brand}</span>
              <Badge variant="outline">{product.category.replace('-', ' ')}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-foreground">
                  €{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <Badge variant="destructive" className="text-sm">
                  Save €{(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Condition */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.condition.rating / 2)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className={`font-medium ${getConditionColor(product.condition.rating)}`}>
                {product.condition.rating}/10 - {getConditionText(product.condition.rating)}
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Default: ${product.size}`} />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map(size => (
                  <SelectItem key={size} value={size}>
                    {size} {size === product.size && '(Original)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              variant="street"
              size="lg"
              onClick={handleAddToCart}
              className="flex-1"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
              <Truck className="w-6 h-6 mx-auto mb-2 text-vintage-orange" />
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-muted-foreground">Orders over €50</div>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-vintage-orange" />
              <div className="text-sm font-medium">Authenticity</div>
              <div className="text-xs text-muted-foreground">Verified items</div>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-vintage-orange" />
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
              <div className="mt-4">
                <h4 className="font-medium mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Product Details</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Brand:</dt>
                    <dd className="font-medium">{product.brand}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Size:</dt>
                    <dd className="font-medium">{product.size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Color:</dt>
                    <dd className="font-medium">{product.color}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category:</dt>
                    <dd className="font-medium">{product.category.replace('-', ' ')}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Condition:</dt>
                    <dd className="font-medium">{product.condition.rating}/10</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Added:</dt>
                    <dd className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h4 className="font-medium mb-3">Condition Details</h4>
                <p className="text-muted-foreground">
                  {product.condition.description}
                </p>
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
              <div className="mt-4 p-4 bg-warm-beige rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> As this is a vintage/used item, please handle with extra care to maintain its condition and longevity.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;