'use client';

import { AddressCard } from '@/components/AddressCard';
import { AddressForm } from '@/components/AddressForm';
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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  useAddressesQuery,
  useAddToAddressMutation,
  useDefaultAddressMutation,
  useRemoveAddressMutation,
  useUpdateAddressMutation,
} from '@/redux/api/addressApi';
import { useCartsQuery } from '@/redux/api/cartApi';
import { useMakeOrderMutation } from '@/redux/api/orderApi';
import { AddressFormData } from '@/schemas/address';
import { AlertCircle, ArrowLeft, MapPin, Package, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  const { toast } = useToast();

  // API Hooks
  const { data: addressData, isLoading: isAddressLoading } = useAddressesQuery({});
  const { data: cartItemsData, isLoading: isCartLoading } = useCartsQuery({});
  const [addToAddress, { isLoading: isCreatingAddress }] = useAddToAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [removeAddress, { isLoading: isDeletingAddress }] = useRemoveAddressMutation();
  const [setDefaultAddress] = useDefaultAddressMutation();
  const [makeOrder, { isLoading: isCreatingOrder }] = useMakeOrderMutation();

  // Local state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  // const [orderNotes, setOrderNotes] = useState('');

  // Extract data
  const addresses = useMemo(() => addressData?.data || [], [addressData]);
  const cart = useMemo(() => cartItemsData?.data, [cartItemsData]);
  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const total = cart?.total || 0;
  const currency = cart?.currency || 'EUR';

  const defaultAddress = addresses.find((addr: any) => addr.default || addr.isDefault);

  // Calculate shipping
  const SHIPPING_THRESHOLD = 1000;
  const SHIPPING_COST = 50;
  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const taxAmount = cart?.taxAmount || 0;
  const discountAmount = cart?.discountAmount || 0;
  const finalTotal = total + shippingCost;

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  // Reset form
  const resetForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  // Handle address form submit
  const handleSaveAddress = async (data: AddressFormData) => {
    try {
      // Generate formatted address
      const formattedAddress = [
        data.addressLine1,
        data.addressLine2,
        data.city,
        data.stateProvince,
        data.postalCode,
        data.countryCode,
      ]
        .filter(Boolean)
        .join(', ');

      const payload = {
        ...data,
        formattedAddress,
      };

      if (editingAddress) {
        // Update existing address
        const result = await updateAddress({
          id: editingAddress.id,
          ...payload,
        }).unwrap();

        if (result.success) {
          toast({
            title: 'Address Updated',
            variant: 'success',
            description: 'Your address has been updated successfully.',
          });

          // Set as default if requested
          if (data.isDefault && !editingAddress.default) {
            await setDefaultAddress(editingAddress.id);
          }
        }
      } else {
        // Create new address
        const result = await addToAddress(payload).unwrap();

        if (result.success) {
          toast({
            title: 'Address Added',
            variant: 'success',
            description: 'Your new address has been saved.',
          });

          // Auto-select newly created address
          if (result.data?.id) {
            setSelectedAddressId(result.data.id);

            // Set as default if requested
            if (data.isDefault) {
              await setDefaultAddress(result.data.id);
            }
          }
        }
      }

      resetForm();
    } catch (error: any) {
      console.error('Address save error:', error);
      toast({
        title: 'Failed to Save Address',
        description: error?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle edit address
  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  // Handle delete address
  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const result = await removeAddress(addressToDelete).unwrap();

      if (result.success) {
        if (selectedAddressId === addressToDelete) {
          setSelectedAddressId(null);
        }
        toast({
          title: 'Address Deleted',
          variant: 'destructive',
          description: 'The address has been removed.',
        });
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: error?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setAddressToDelete(null);
    }
  };

  // Handle place order
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
      const orderPayload = {
        shippingInfo: {
          addressId: selectedAddressId,
        },
        paymentMethod: 'MOLLIE',
        paymentConfirmationUrl: 'https://bytetechnik.de',
        createAccount: false,
        // ...(orderNotes && { notes: orderNotes }),
      };
      const result = await makeOrder(orderPayload).unwrap();

      if (result.success) {
        toast({
          title: 'Order Placed Successfully!',
          description: `Order has been created.`,
        });
        // Redirect to order details or success page
        if (result.data?.approvalUrl) {
          router.push(result.data?.approvalUrl);
        }
      }
    } catch (error: any) {
      console.error('Order error:', error);
      toast({
        title: 'Order Failed',
        description: error?.data?.message || 'Could not place order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Prepare initial data for editing
  const getInitialEditData = (): Partial<AddressFormData> | undefined => {
    if (!editingAddress) return undefined;

    return {
      type: editingAddress.addressType || editingAddress.type || 'SHIPPING',
      firstName: editingAddress.firstName || '',
      lastName: editingAddress.lastName || '',
      company: editingAddress.company || '',
      phoneNo: editingAddress.phoneNo || '',
      email: editingAddress.email || '',
      addressLine1: editingAddress.addressLine1 || editingAddress.street || '',
      addressLine2: editingAddress.addressLine2 || '',
      city: editingAddress.city || '',
      stateProvince: editingAddress.stateProvince || editingAddress.state || '',
      postalCode: editingAddress.postalCode || '',
      countryCode: editingAddress.countryCode || editingAddress.country || 'BD',
      formattedAddress: editingAddress.formattedAddress || '',
      isDefault: editingAddress.default || editingAddress.isDefault || false,
      latitude: editingAddress.latitude,
      longitude: editingAddress.longitude,
    };
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
      <div className=" bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-24  rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
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
    <div className=" bg-gradient-to-b from-background to-muted/20">
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
                  <AddressForm
                    onSubmit={handleSaveAddress}
                    onCancel={resetForm}
                    initialData={getInitialEditData()}
                    isLoading={isCreatingAddress || isUpdatingAddress}
                    isEditing={!!editingAddress}
                  />
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
                          <AddressCard
                            key={address.id}
                            address={address}
                            isSelected={selectedAddressId === address.id}
                            onSelect={() => setSelectedAddressId(address.id)}
                            onEdit={() => handleEditAddress(address)}
                            onDelete={() => {
                              setAddressToDelete(address.id);
                              setShowDeleteDialog(true);
                            }}
                            isDeleting={isDeletingAddress}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Order Notes */}
            {/* <Card className="border-2 shadow-lg">
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
              </CardContent>
            </Card> */}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 pb-3">
            <div className="bg-card rounded-lg p-6 shadow-lg sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-3 mt-2">
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
                {taxAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">
                      {currency} {taxAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">
                      -{currency} {discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
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
                size="lg"
                variant="street"
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
                <div className="mt-4 p-3 bg-destructive/10 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">
                    Please select a delivery address to continue
                  </p>
                </div>
              )}

              {/* <div className="mt-4 text-xs text-muted-foreground text-center space-y-1">
                <p>🔒 Your information is secure</p>
                <p>✓ Cash on Delivery available</p>
              </div> */}
            </div>
          </div>
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
    </div>
  );
};

export default Checkout;