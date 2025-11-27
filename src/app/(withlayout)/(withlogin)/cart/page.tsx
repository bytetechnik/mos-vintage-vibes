'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import {
  useCartsQuery,
  useDeleteCartMutation,
  useInsDesItemMutation,
  useRemoveFromCartMutation
} from '@/redux/api/cartApi';
import { CartItem, CartResponse } from '@/types/cart';
import { AlertCircle, Minus, Package, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const Cart = () => {
  const { data: cartItemsData, isLoading, isError } = useCartsQuery({});
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  const [insDesItem, { isLoading: isUpdating }] = useInsDesItemMutation();
  const [deleteCart, { isLoading: isClearing }] = useDeleteCartMutation();

  const [showClearDialog, setShowClearDialog] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [localQuantities, setLocalQuantities] = useState<Record<string, string>>({});
  const updateTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Memoized cart data
  const cartData = useMemo(() => (cartItemsData as CartResponse)?.data, [cartItemsData]);
  const cartItems: CartItem[] = useMemo(() => cartData?.items || [], [cartData]);
  const subtotal: number = cartData?.subtotal || 0;
  const currency: string = cartData?.currency || 'EUR';

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // Initialize local quantities when cart loads
  useEffect(() => {
    if (cartItems.length > 0) {
      const quantities: Record<string, string> = {};
      cartItems.forEach(item => {
        quantities[item.id] = item.quantity.toString();
      });
      setLocalQuantities(quantities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(updateTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // 🧮 Update item quantity with debounce
  const updateQuantity = useCallback(async (id: string, newQty: number): Promise<void> => {
    if (newQty < 1 || isUpdating) return;

    setUpdatingItemId(id);
    try {
      await insDesItem({ id, data: { quantity: newQty } }).unwrap();
      toast({
        title: 'Quantity Updated',
        description: `Quantity set to ${newQty}`,
        variant: 'success',
      });
    } catch (error: any) {
      console.error(error);
      // Revert to original quantity on error
      const originalItem = cartItems.find(item => item.id === id);
      if (originalItem) {
        setLocalQuantities(prev => ({
          ...prev,
          [id]: originalItem.quantity.toString()
        }));
      }
      toast({
        title: 'Update Failed',
        description: error?.data?.message || 'Could not update quantity. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingItemId(null);
    }
  }, [insDesItem, isUpdating, cartItems]);

  // Handle input change with debounce
  const handleQuantityChange = useCallback((id: string, value: string) => {
    // Update local state immediately
    setLocalQuantities(prev => ({ ...prev, [id]: value }));

    // Clear existing timeout
    if (updateTimeouts.current[id]) {
      clearTimeout(updateTimeouts.current[id]);
    }

    // Parse and validate
    const numValue = parseInt(value);
    if (value === '' || isNaN(numValue) || numValue < 1) {
      return; // Don't update API for invalid values
    }

    // Set new timeout to update API
    updateTimeouts.current[id] = setTimeout(() => {
      updateQuantity(id, numValue);
    }, 800); // Wait 800ms after user stops typing
  }, [updateQuantity]);

  // Handle increment/decrement
  const handleQuantityAdjust = useCallback((id: string, delta: number) => {
    const currentQty = parseInt(localQuantities[id] || '1');
    const newQty = Math.max(1, currentQty + delta);

    // Update local state
    setLocalQuantities(prev => ({ ...prev, [id]: newQty.toString() }));

    // Clear existing timeout
    if (updateTimeouts.current[id]) {
      clearTimeout(updateTimeouts.current[id]);
    }

    // Update API immediately for button clicks
    updateQuantity(id, newQty);
  }, [localQuantities, updateQuantity]);

  const removeItem = useCallback(async (id: string): Promise<void> => {
    if (isRemoving) return;

    setRemovingItemId(id);
    try {
      await removeFromCart(id).unwrap();
      toast({
        title: 'Item Removed',
        description: 'The item has been removed from your cart.',
        variant: 'success',
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Removal Failed',
        description: error?.data?.message || 'Could not remove item. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRemovingItemId(null);
    }
  }, [removeFromCart, isRemoving]);

  // 🧹 Clear entire cart
  const clearCart = useCallback(async (): Promise<void> => {
    try {
      await deleteCart({}).unwrap();
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart.',
        variant: 'success',
      });
      setShowClearDialog(false);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Clear Failed',
        description: error?.data?.message || 'Could not clear cart. Please try again.',
        variant: 'destructive',
      });
    }
  }, [deleteCart]);

  // 🎨 Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // ⚠️ Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Unable to Load Cart</h1>
        <p className="text-muted-foreground mb-8">
          There was an error loading your cart. Please try again.
        </p>
        <Button variant="street" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  // 🛒 Empty cart UI
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Discover unique vintage streetwear pieces and start building your collection.
        </p>
        <Link href="/products">
          <Button variant="street" size="lg">
            <Package className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  // ✅ Render cart
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🧺 Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const isItemUpdating = updatingItemId === item.id;
            const isItemRemoving = removingItemId === item.id;
            const isItemDisabled = isItemUpdating || isItemRemoving;

            return (
              <div
                key={item.id}
                className={`bg-card rounded-lg p-6 shadow-card-custom transition-opacity ${isItemDisabled ? 'opacity-50 pointer-events-none' : ''
                  }`}
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <Link href={`/products/${item.productId}`} className="shrink-0">
                    <div className="relative group">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        width={96}
                        height={96}
                        className="object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute -top-2 -right-2 bg-vintage-orange text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-semibold hover:text-vintage-orange transition line-clamp-2">
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.brandName}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <span className="font-medium">Size:</span> {item.size}
                      </span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="font-medium">Condition:</span> {item.conditionRating}/10
                      </span>
                    </div>
                  </div>

                  {/* Price + Quantity */}
                  <div className="text-right flex flex-col">
                    <div className="text-lg font-semibold mb-1">
                      {currency} {item.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {currency} {item.unitPrice.toFixed(2)} each
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-end gap-2 mb-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityAdjust(item.id, -1)}
                        disabled={parseInt(localQuantities[item.id] || '1') <= 1 || isItemDisabled}
                        className="h-8 w-8"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={localQuantities[item.id] || item.quantity}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                            handleQuantityChange(item.id, value);
                          }}
                          onBlur={(e) => {
                            // On blur, ensure valid quantity
                            const value = e.target.value;
                            const numValue = parseInt(value);
                            if (value === '' || isNaN(numValue) || numValue < 1) {
                              setLocalQuantities(prev => ({
                                ...prev,
                                [item.id]: item.quantity.toString()
                              }));
                            }
                          }}
                          disabled={isItemDisabled}
                          className="w-16 h-8 text-center"
                        />
                        {isItemUpdating && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded">
                            <div className="w-3 h-3 border-2 border-vintage-orange border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityAdjust(item.id, 1)}
                        disabled={isItemDisabled}
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
                      disabled={isItemDisabled}
                      className="text-destructive hover:text-destructive/80 mt-auto"
                    >
                      {isItemRemoving ? (
                        <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin mr-1" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-1" />
                      )}
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cart Actions */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowClearDialog(true)}
              disabled={isClearing}
              className="text-destructive hover:text-destructive/80 w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>

          </div>
        </div>

        {/* 🧾 Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-card-custom sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
                <span className="font-medium">
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {currency} {subtotal.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/checkout" className="block mt-6">
              <Button variant="street" size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Link href="/products" className="mx-auto mt-5 flex justify-center">
        <Button variant="outline" className="">
          Continue Shopping
        </Button>
      </Link>
      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {totalItems} {totalItems === 1 ? 'item' : 'items'} from your cart. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={clearCart}
              disabled={isClearing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isClearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Clearing...
                </>
              ) : (
                'Clear Cart'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Cart;