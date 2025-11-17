import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Package, Truck } from 'lucide-react';
import Link from 'next/link';

const OrderConfirmation = () => {
  // In a real app, this would come from the order data
  const orderNumber = "MV-" + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-neon-accent mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-muted-foreground">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-card rounded-lg p-8 shadow-card-custom mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Details</h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-mono font-semibold">{orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Delivery:</span>
              <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-card rounded-lg shadow-card-custom">
            <Mail className="w-8 h-8 text-vintage-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email Confirmation</h3>
            <p className="text-sm text-muted-foreground">
              Check your email for order confirmation and tracking details
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-card-custom">
            <Package className="w-8 h-8 text-vintage-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Processing</h3>
            <p className="text-sm text-muted-foreground">
              Your order is being prepared and will ship within 1-2 business days
            </p>
          </div>

          <div className="text-center p-6 bg-card rounded-lg shadow-card-custom">
            <Truck className="w-8 h-8 text-vintage-orange mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Shipping</h3>
            <p className="text-sm text-muted-foreground">
              Track your package and get delivery updates via email and SMS
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="street" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              View Order Status
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-warm-beige rounded-lg">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your order, please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
            <Button variant="outline" size="sm">
              View FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;