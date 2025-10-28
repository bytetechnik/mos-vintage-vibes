'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCartsQuery } from '@/redux/api/cartApi';
import { CartItem, CartResponse } from '@/types/cart';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Cart = () => {
  const { data: cartItemsData, isLoading } = useCartsQuery({});

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p>Loading cart...</p>
        </div>
      </div>
    );
  }

  const cartData = (cartItemsData as CartResponse)?.data;
  const cartItems: CartItem[] = cartData?.items || [];

  const subtotal: number = cartData?.subtotal || 0;
  const total: number = cartData?.total || 0;
  const currency: string = cartData?.currency || 'BDT';

  // TODO: Implement these functions with API mutations
  const updateQuantity = (id: string, newQty: number): void => {
    if (newQty < 1) return;
    console.log('Update quantity:', id, newQty);
    // Add mutation here
  };

  const removeItem = (id: string): void => {
    console.log('Remove item:', id);
    // Add mutation here
  };

  const clearCart = (): void => {
    console.log('Clear cart');
    // Add mutation here
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Start shopping to add items to your cart
          </p>
          <Link href="/products">
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
            {cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="bg-card rounded-lg p-6 shadow-card-custom"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/products/${item.productId}`} className="shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={96}
                      height={96}
                      className="object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-foreground hover:text-vintage-orange transition-colors">
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.brandName}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-muted-foreground">
                        Size: {item.size}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Condition: {item.conditionRating}/10
                      </span>
                    </div>
                  </div>

                  {/* Price and Quantity */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-foreground mb-2">
                      {currency} {item.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {currency} {item.unitPrice.toFixed(2)} each
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 h-8 text-center"
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
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
            <Link href="/products">
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
                <span>Subtotal ({cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)} items)</span>
                <span>{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{subtotal >= 1000 ? 'Free' : `${currency} 50`}</span>
              </div>
              {cartData?.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{currency} {cartData.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {cartData?.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{currency} {cartData.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{currency} {(total + (subtotal >= 1000 ? 0 : 50)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {subtotal < 1000 && (
              <div className="mt-4 p-3 bg-vintage-orange/10 rounded-lg">
                <p className="text-sm text-vintage-orange">
                  Add {currency} {(1000 - subtotal).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}

            <Link href="/checkout" className="block mt-6">
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