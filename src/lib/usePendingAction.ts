// hooks/usePendingAction.ts
'use client';

import { useToast } from '@/hooks/use-toast';
import { useAddToCartMutation } from '@/redux/api/cartApi';
import { useAddToWishListMutation } from '@/redux/api/wishList';
import { clearPendingAction, getPendingAction, isAuthenticated } from '@/utils/auth-helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const usePendingAction = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [addToCart] = useAddToCartMutation();
  const [addToWishList] = useAddToWishListMutation();

  useEffect(() => {
    const executePendingAction = async () => {
      // Only run on client

      if (typeof window === 'undefined') return;

      // Check if user is authenticated
      if (!isAuthenticated()) return;

      // Check if there's a pending action
      const pendingAction = getPendingAction();

      if (!pendingAction) return;

      setIsProcessing(true);

      try {
        if (pendingAction.type === 'add-to-cart') {

          if (!pendingAction.variantId) {
            toast({
              title: 'Error',
              description: 'Variant information missing',
              variant: 'destructive',
            });
            clearPendingAction();
            setIsProcessing(false);
            return;
          }

          await addToCart({
            productId: pendingAction.productId,
            variantId: pendingAction.variantId,
            quantity: pendingAction.quantity || 1,
            currency: 'EUR',
          }).unwrap();

          toast({
            title: 'Success!',
            description: 'Item added to cart',
            variant: 'success',
          });
        }
        else if (pendingAction.type === 'add-to-wishlist') {
          await addToWishList({
            productId: pendingAction.productId,
          }).unwrap();

          toast({
            title: 'Success!',
            description: 'Item added to wishlist',
            variant: 'success',
          });
        }

        // Clear the pending action
        clearPendingAction();

        // Redirect to the original page
        if (pendingAction.redirectUrl) {
          // Use a small delay to ensure toast is visible
          setTimeout(() => {
            router.push(pendingAction.redirectUrl!);
          }, 1000);
        }
      } catch (error: any) {
        console.error('Error executing pending action:', error);
        toast({
          title: 'Error',
          description: 'Failed to execute action. Please try again.',
          variant: 'destructive',
        });
        clearPendingAction();
      } finally {
        setIsProcessing(false);
      }
    };

    // Small delay to ensure auth state is updated
    const timer = setTimeout(executePendingAction, 500);
    return () => clearTimeout(timer);
  }, [addToCart, addToWishList, toast, router]);

  return { isProcessing };
};