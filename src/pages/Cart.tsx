import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';

const Cart = () => {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start shopping to add items to your cart
          </p>
          <Link to="/products">
            <Button variant="street" size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="bg-card rounded-lg p-6 shadow-card-custom">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-semibold text-foreground hover:text-vintage-orange transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-muted-foreground">
                        Size: {item.selectedSize || item.product.size}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Condition: {item.product.condition.rating}/10
                      </span>
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground mb-2">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      €{item.product.price.toFixed(2)} each
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                        className="w-16 h-8 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-6 flex justify-between items-center">
            <Button variant="ghost" onClick={clearCart} className="text-destructive">
              Clear Cart
            </Button>
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-card-custom sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{total >= 50 ? 'Free' : '€4.99'}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>€{(total + (total >= 50 ? 0 : 4.99)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {total < 50 && (
              <div className="mt-4 p-3 bg-vintage-orange/10 rounded-lg">
                <p className="text-sm text-vintage-orange">
                  Add €{(50 - total).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            <Link to="/checkout" className="block mt-6">
              <Button variant="street" size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              Secure checkout with SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;