"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Mail, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Checkout = () => {
  const router = useRouter();
  const { toast } = useToast();

  // Mock cart from products (just first 2 for demo)
  const items = products.slice(0, 2).map((p) => ({
    product: p,
    quantity: 1,
    selectedSize: p.size || "M",
  }));

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const [isGuest, setIsGuest] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Germany",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const [guestAccount, setGuestAccount] = useState({
    email: "",
    createAccount: false,
    password: "",
    confirmPassword: "",
  });

  const shipping = total >= 50 ? 0 : 4.99;
  const finalTotal = total + shipping;

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    setTimeout(() => {
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
      router.push("/order-confirmation");
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/cart")}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Tabs value={isGuest ? "guest" : "account"} className="w-full">
            {/* Account Type Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Checkout Options</h2>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="guest" onClick={() => setIsGuest(true)}>
                  Guest Checkout
                </TabsTrigger>
                <TabsTrigger value="account" onClick={() => setIsGuest(false)}>
                  Create Account
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guest" className="space-y-6">
              {/* Guest Email */}
              <div className="bg-card p-6 rounded-lg shadow-card-custom">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <div>
                  <Label htmlFor="guest-email">Email Address</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={guestAccount.email}
                    onChange={(e) =>
                      setGuestAccount({
                        ...guestAccount,
                        email: e.target.value,
                      })
                    }
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              {/* Account Creation */}
              <div className="bg-card p-6 rounded-lg shadow-card-custom">
                <h3 className="text-lg font-semibold mb-4">
                  Create Your Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="account-email">Email Address</Label>
                    <Input
                      id="account-email"
                      type="email"
                      value={guestAccount.email}
                      onChange={(e) =>
                        setGuestAccount({
                          ...guestAccount,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={guestAccount.password}
                      onChange={(e) =>
                        setGuestAccount({
                          ...guestAccount,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={guestAccount.confirmPassword}
                      onChange={(e) =>
                        setGuestAccount({
                          ...guestAccount,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Shipping Info */}
          <div className="bg-card p-6 rounded-lg shadow-card-custom mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={shippingInfo.firstName}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={shippingInfo.lastName}
                  onChange={(e) =>
                    setShippingInfo({
                      ...shippingInfo,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-card p-6 rounded-lg shadow-card-custom mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-card-custom sticky top-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3"
                >
                  <div className="relative w-12 h-12">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Size: {item.selectedSize} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>€{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              variant="street"
              size="lg"
              className="w-full mt-6"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Place Order - €${finalTotal.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
