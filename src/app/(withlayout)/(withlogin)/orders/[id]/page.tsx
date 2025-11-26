'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useValidateOrderMutation } from '@/redux/api/orderApi';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Home,
  Loader2,
  Package,
  Receipt,
  ShoppingBag,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

const OrderConfirmation = () => {
  const params = useParams();
  const paymentReference = params?.id as string;

  const [validateOrder, { isLoading }] = useValidateOrderMutation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [validationStatus, setValidationStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    if (paymentReference) {
      handleValidateOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentReference]);

  const handleValidateOrder = async () => {
    setValidationStatus('loading');
    try {
      const result = await validateOrder({
        paymentReference: paymentReference,
      }).unwrap();

      if (result.success && result.data) {
        setOrderData(result.data);

        const successStatuses = ['CONFIRMED', 'PROCESSING', 'PENDING', 'SHIPPED', 'DELIVERED'];
        const status = result.data.status?.toUpperCase();

        if (successStatuses.includes(status)) {
          setValidationStatus('success');
        } else {
          setValidationStatus('failed');
        }
      } else {
        setValidationStatus('failed');
      }
    } catch (err) {
      console.error('Order validation failed:', err);
      setValidationStatus('failed');
    }
  };

  // Loading State
  if (validationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-lg border p-8 text-center shadow-lg">
          <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Validating Your Order</h2>
          <p className="text-muted-foreground mb-6">
            Please wait while we confirm your payment...
          </p>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (validationStatus === 'success' && orderData) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-card rounded-lg border shadow-card-custom p-8 mb-6 text-center">
            <div className="w-20 h-20 rounded-full bg-neon-accent/10 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-neon-accent" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>

            <p className="text-lg text-muted-foreground mb-6">
              Thank you for your purchase! Your order has been successfully placed.
            </p>

            <div className="inline-flex items-center gap-3 bg-warm-beige px-6 py-3 rounded-lg border">
              <Receipt className="w-5 h-5 text-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Order Number</p>
                <p className="font-mono font-semibold text-lg text-foreground">
                  {orderData.orderNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-card rounded-lg border shadow-card-custom p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b">
              <Package className="w-6 h-6 text-vintage-orange" />
              <h2 className="text-2xl font-semibold">Order Summary</h2>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b">
              <div className="space-y-2 p-4 rounded-lg bg-warm-beige">
                <p className="text-sm text-muted-foreground font-medium">Order Date</p>
                <p className="font-semibold text-lg">
                  {new Date(orderData.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(orderData.orderDate).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-warm-beige">
                <p className="text-sm text-muted-foreground font-medium">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-accent" />
                  <span className="font-semibold text-lg text-neon-accent">
                    {orderData.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-lg bg-warm-beige">
                <p className="text-sm text-muted-foreground font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  EUR {orderData.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-vintage-orange" />
                Items Ordered ({orderData.items.length})
              </h3>

              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-warm-beige border hover:shadow-card-custom transition-shadow duration-200"
                  >
                    {item.image ? (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-background border">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0 border">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {item.productName}
                      </h4>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-3 py-1 rounded-md bg-background border font-medium">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-muted-foreground">×</span>
                        <span className="font-semibold text-foreground">
                          EUR {item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                      <p className="font-bold text-xl text-foreground">
                        EUR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-card rounded-lg border shadow-card-custom p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-vintage-orange" />
              <h2 className="text-2xl font-semibold">What Happens Next?</h2>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-vintage-orange text-white flex items-center justify-center flex-shrink-0 font-semibold text-lg">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Email Confirmation
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    You&apos;ll receive an email confirmation with your order details and receipt within the next few minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-vintage-orange text-white flex items-center justify-center flex-shrink-0 font-semibold text-lg">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Order Processing
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your order is being prepared and will ship within 1-2 business days. Track progress anytime.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-vintage-orange text-white flex items-center justify-center flex-shrink-0 font-semibold text-lg">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Shipping & Delivery
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Track your package and get delivery updates via email and SMS notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" size="lg" className="w-full h-12 text-base font-semibold gap-2">
                <Receipt className="w-5 h-5" />
                View Order History
              </Button>
            </Link>
            <Link href="/products" className="flex-1">
              <Button variant="street" size="lg" className="w-full h-12 text-base font-semibold gap-2">
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Error Header */}
        <div className="bg-card rounded-lg border shadow-card-custom p-8 mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-6 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Payment Failed
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            We couldn&apos;t process your payment. Please review the details below and try again.
          </p>

          {paymentReference && (
            <div className="inline-flex items-center gap-3 bg-warm-beige px-6 py-3 rounded-lg border">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Reference ID</p>
                <p className="font-mono font-semibold text-sm">
                  {paymentReference.length > 20 ? `${paymentReference.slice(0, 20)}...` : paymentReference}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Details */}
        <div className="bg-card rounded-lg border shadow-card-custom p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-vintage-orange" />
            <h2 className="text-2xl font-semibold">Common Issues</h2>
          </div>

          <ul className="space-y-4">
            <li className="flex gap-4 p-4 rounded-lg bg-warm-beige">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Payment Not Completed</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The payment transaction may not have been completed successfully or was interrupted.
                </p>
              </div>
            </li>
            <li className="flex gap-4 p-4 rounded-lg bg-warm-beige">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Insufficient Funds</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your payment method may have insufficient funds or reached its transaction limit.
                </p>
              </div>
            </li>
            <li className="flex gap-4 p-4 rounded-lg bg-warm-beige">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Invalid Payment Reference</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The payment reference provided may be incorrect, expired, or already used.
                </p>
              </div>
            </li>
            <li className="flex gap-4 p-4 rounded-lg bg-warm-beige">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold mb-1">Technical Issue</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  There may have been a temporary technical issue during the payment process.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-warm-beige rounded-lg border p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-vintage-orange" />
            <h3 className="text-xl font-semibold">What Should You Do?</h3>
          </div>

          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-muted-foreground leading-relaxed pl-2">
              <span className="font-medium text-foreground">Check your email</span> for any payment confirmation or failure notification
            </li>
            <li className="text-muted-foreground leading-relaxed pl-2">
              <span className="font-medium text-foreground">Verify payment method</span> has sufficient funds and is valid
            </li>
            <li className="text-muted-foreground leading-relaxed pl-2">
              <span className="font-medium text-foreground">Contact your bank</span> if a charge was made but the order failed
            </li>
            <li className="text-muted-foreground leading-relaxed pl-2">
              <span className="font-medium text-foreground">Reach out to support</span> if the issue persists or you need assistance
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={handleValidateOrder}
            disabled={isLoading}
            className="flex-1 h-12 text-base font-semibold gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                Try Again
              </>
            )}
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="street" size="lg" className="w-full h-12 text-base font-semibold gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Still having trouble? We&apos;re here to help
          </p>
          <Link href="/support" className="inline-flex items-center gap-2 text-base font-semibold text-vintage-orange hover:underline">
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;