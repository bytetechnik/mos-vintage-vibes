
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import { useCartsQuery } from '@/redux/api/cartApi';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Cart = () => {
  // Mock cart state using products
  const [cartItems, setCartItems] = useState(() =>
    products.slice(0, 2).map((p) => ({
      product: p,
      quantity: 1,
      selectedSize: p.size,
    }))
  );

  const { data: cartItemsData } = useCartsQuery({});
  //   {
  //     "statusCode": 200,
  //     "success": true,
  //     "message": "Cart retrieved successfully.",
  //     "timestamp": "2025-10-27T00:54:36.882530719",
  //     "error": null,
  //     "data": {
  //         "id": "ee36f981-47c2-4187-9982-13ffd6f2efe7",
  //         "userId": "446ef897-7cc8-4a2f-9be5-e3494a3431a5",
  //         "sessionId": null,
  //         "subtotal": 364,
  //         "taxAmount": 0,
  //         "discountAmount": 0,
  //         "total": 364,
  //         "currency": "BDT",
  //         "expiresAt": null,
  //         "items": [
  //             {
  //                 "id": "6f771013-9243-4862-a591-3f3748e56714",
  //                 "productId": "9a59e046-d36f-464f-99ad-35400a45ee1d",
  //                 "variantId": "5215b48e-d989-46ea-86ca-4b133529eec7",
  //                 "quantity": 1,
  //                 "unitPrice": 364,
  //                 "totalPrice": 364
  //             }
  //         ]
  //     },
  //     "meta": null
  // }

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const clearCart = () => setCartItems([]);

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
            {cartItems.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="bg-card rounded-lg p-6 shadow-card-custom"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/products/${item.product.id}`} className="shrink-0">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={96}   // 👈 equivalent to w-24 (24 * 4 = 96px)
                      height={96}  // 👈 equivalent to h-24
                      className="object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`}>
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
                        onChange={(e) =>
                          updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                        }
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
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
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
