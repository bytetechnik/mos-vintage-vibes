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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCartsQuery } from '@/redux/api/cartApi';
import {
  AlertCircle,
  ArrowLeft,
  Building,
  Check,
  Edit,
  Home,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  const { toast } = useToast();

  // API Hooks - Cart only
  const { data: cartItemsData, isLoading: isCartLoading } = useCartsQuery({});

  // Mock API states
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Mock addresses data
  const [addresses, setAddresses] = useState<any[]>([]);

  // Local state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState<any>({
    type: 'home',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Bangladesh',
    isDefault: false,
  });

  // Extract cart data
  const cart = useMemo(() => cartItemsData?.data, [cartItemsData]);
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;
  const currency = cart?.currency || 'BDT';

  const defaultAddress = addresses.find((addr: any) => addr.isDefault);

  // Calculate shipping
  const SHIPPING_THRESHOLD = 1000;
  const SHIPPING_COST = 50;
  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const finalTotal = total + shippingCost;

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  // Load mock addresses
  useEffect(() => {
    const loadAddresses = async () => {
      setIsAddressLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const savedAddresses = localStorage.getItem('checkoutAddresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
      setIsAddressLoading(false);
    };
    loadAddresses();
  }, []);

  // Reset form
  const resetForm = () => {
    setAddressForm({
      type: 'home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Bangladesh',
      isDefault: false,
    });
    setEditingAddress(null);
    setShowAddressForm(false);
    setSaveAsDefault(false);
  };

  // Handle address form submit (Mock)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAddress) {
        setIsUpdatingAddress(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedAddresses = addresses.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...addressForm, isDefault: saveAsDefault }
            : saveAsDefault ? { ...addr, isDefault: false } : addr
        );
        setAddresses(updatedAddresses);
        localStorage.setItem('checkoutAddresses', JSON.stringify(updatedAddresses));

        toast({
          title: 'Address Updated',
          description: 'Your address has been updated successfully.',
        });
        setIsUpdatingAddress(false);
      } else {
        setIsCreatingAddress(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const newAddress = {
          id: `addr_${Date.now()}`,
          ...addressForm,
          isDefault: saveAsDefault,
          createdAt: new Date().toISOString(),
        };

        const updatedAddresses = saveAsDefault
          ? [newAddress, ...addresses.map(a => ({ ...a, isDefault: false }))]
          : [...addresses, newAddress];

        setAddresses(updatedAddresses);
        localStorage.setItem('checkoutAddresses', JSON.stringify(updatedAddresses));
        setSelectedAddressId(newAddress.id);

        toast({
          title: 'Address Added',
          description: 'Your new address has been saved.',
        });
        setIsCreatingAddress(false);
      }
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Failed to Save Address',
        description: 'Please try again.',
        variant: 'destructive',
      });
      setIsCreatingAddress(false);
      setIsUpdatingAddress(false);
    }
  };

  // Handle edit address
  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state || '',
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setSaveAsDefault(address.isDefault);
    setShowAddressForm(true);
  };

  // Handle delete address (Mock)
  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      setIsDeletingAddress(true);
      await new Promise(resolve => setTimeout(resolve, 600));

      const updatedAddresses = addresses.filter(addr => addr.id !== addressToDelete);
      setAddresses(updatedAddresses);
      localStorage.setItem('checkoutAddresses', JSON.stringify(updatedAddresses));

      if (selectedAddressId === addressToDelete) {
        setSelectedAddressId(null);
      }
      toast({
        title: 'Address Deleted',
        description: 'The address has been removed.',
      });
    } catch (error: any) {
      console.log(error);
      toast({
        title: 'Delete Failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAddress(false);
      setShowDeleteDialog(false);
      setAddressToDelete(null);
    }
  };

  // Handle place order (Mock)
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: 'Address Required',
        description: 'Please select a delivery address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreatingOrder(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderNumber = `ORD${Date.now().toString().slice(-8)}`;
      const orderId = `order_${Date.now()}`;

      const mockOrder = {
        id: orderId,
        orderNumber,
        addressId: selectedAddressId,
        notes: orderNotes || undefined,
        items: cartItems,
        subtotal,
        shippingCost,
        total: finalTotal,
        currency,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([mockOrder, ...existingOrders]));

      toast({
        title: 'Order Placed Successfully!',
        description: `Order #${orderNumber} has been created.`,
      });

      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Order Failed',
        description: 'Could not place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Loading state
  if (isCartLoading || isAddressLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Empty cart
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Add items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button size="lg" className="gap-2">
              <Package className="w-5 h-5" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/cart')}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
              <p className="text-muted-foreground mt-2">Complete your purchase securely</p>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span>Delivery Address</span>
                  </CardTitle>
                  {!showAddressForm && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddressForm(true)}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add New
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Address Form */}
                {showAddressForm ? (
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="type">Address Type</Label>
                        <Select
                          value={addressForm.type}
                          onValueChange={(value: 'home' | 'work' | 'other') =>
                            setAddressForm({ ...addressForm, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">
                              <div className="flex items-center gap-2">
                                <Home className="w-4 h-4" />
                                Home
                              </div>
                            </SelectItem>
                            <SelectItem value="work">
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Work
                              </div>
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={addressForm.fullName}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, fullName: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, phone: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={addressForm.country}
                          onValueChange={(value) =>
                            setAddressForm({ ...addressForm, country: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="Pakistan">Pakistan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="addressLine1">Street Address *</Label>
                      <Input
                        id="addressLine1"
                        value={addressForm.addressLine1}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, addressLine1: e.target.value })
                        }
                        placeholder="House number and street name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="addressLine2">
                        Apartment, suite, etc. (optional)
                      </Label>
                      <Input
                        id="addressLine2"
                        value={addressForm.addressLine2}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, addressLine2: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, city: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="state">State / Province</Label>
                        <Input
                          id="state"
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, state: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, postalCode: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveAsDefault"
                        checked={saveAsDefault}
                        onCheckedChange={(checked) => setSaveAsDefault(checked as boolean)}
                      />
                      <Label htmlFor="saveAsDefault" className="cursor-pointer">
                        Save as default address
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isCreatingAddress || isUpdatingAddress}
                      >
                        {isCreatingAddress || isUpdatingAddress ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : editingAddress ? (
                          'Update Address'
                        ) : (
                          'Save Address'
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    {addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                          <MapPin className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No saved addresses</h3>
                        <p className="text-muted-foreground mb-6">
                          Add a delivery address to continue with your order
                        </p>
                        <Button onClick={() => setShowAddressForm(true)} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Your First Address
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address: any) => (
                          <div
                            key={address.id}
                            className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedAddressId === address.id
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50'
                              }`}
                            onClick={() => setSelectedAddressId(address.id)}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selectedAddressId === address.id
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                                  }`}
                              >
                                {selectedAddressId === address.id && (
                                  <Check className="w-4 h-4 text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="font-bold text-lg">{address.fullName}</span>
                                  {address.isDefault && (
                                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-semibold">
                                      Default
                                    </span>
                                  )}
                                  <span className="text-xs bg-muted px-3 py-1 rounded-full capitalize font-medium">
                                    {address.type === 'home' && <Home className="w-3 h-3 inline mr-1" />}
                                    {address.type === 'work' && <Building className="w-3 h-3 inline mr-1" />}
                                    {address.type}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                  📱 {address.phone}
                                </p>
                                <p className="text-sm leading-relaxed">
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {address.city}
                                  {address.state && `, ${address.state}`} {address.postalCode}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {address.country}
                                </p>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-muted"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAddress(address);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddressToDelete(address.id);
                                    setShowDeleteDialog(true);
                                  }}
                                  disabled={isDeletingAddress}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <span>Order Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Add any special instructions for your order (optional)..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {/* 💡 Example: "Please ring the doorbell twice" or "Leave at front desk" */}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-card-custom sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pt-2" >
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover rounded"
                      />
                      {item.quantity > 1 && (
                        <div className="absolute -top-2 -right-2 bg-vintage-orange text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2">
                        {item.productName}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold">
                      {currency} {item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'Free' : `${currency} ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {/* {cart?.taxAmount && cart.taxAmount > 0 && ( */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    {currency} {cart.taxAmount.toFixed(2)}
                  </span>
                </div>
                {/* )} */}
                {/* {cart?.discountAmount && cart.discountAmount > 0 && ( */}
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -{currency} {cart.discountAmount.toFixed(2)}
                  </span>
                </div>
                {/* )} */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">
                      {currency} {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                variant="street"
                size="lg"
                className="w-full mt-6"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  `Place Order • ${currency} ${finalTotal.toFixed(2)}`
                )}
              </Button>

              {!selectedAddressId && addresses.length > 0 && (
                <div className="mt-4 p-3 bg-vintage-orange/10 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-vintage-orange shrink-0 mt-0.5" />
                  <p className="text-xs text-vintage-orange">
                    Please select a delivery address to continue
                  </p>
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
                <p>🔒 Your information is secure</p>
                <p>✓ Cash on Delivery available</p>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>

        {/* Delete Address Confirmation */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Address?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this address? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingAddress}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAddress}
                disabled={isDeletingAddress}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isDeletingAddress ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div >
  );
};

export default Checkout;