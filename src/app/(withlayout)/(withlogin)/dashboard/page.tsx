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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  useAddressesQuery,
  useAddToAddressMutation,
  useDefaultAddressMutation,
  useRemoveAddressMutation,
  useUpdateAddressMutation,
} from '@/redux/api/addressApi';
import { useOrdersQuery } from '@/redux/api/orderApi';
import { useProfileQuery, useUpdateProfileMutation } from '@/redux/api/userApi';
import { useRemoveFromWishListMutation, useWhishlistQuery } from '@/redux/api/wishListApi';
import { AddressFormData } from '@/schemas/address';
import { UpdateProfileRequest } from '@/types/api';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Heart,
  Loader2,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  Truck,
  User,
  X,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { EU_COUNTRIES } from '../checkout/page';

const Dashboard = () => {
  const { toast } = useToast();

  // API Hooks
  const { data: profileData, isLoading: isLoadingProfile } = useProfileQuery({});
  const { data: ordersData, isLoading: isLoadingOrders } = useOrdersQuery({});
  const { data: wishlistData, isLoading: isLoadingWishlist } = useWhishlistQuery({});
  const { data: addressData, isLoading: isLoadingAddress } = useAddressesQuery({});
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [removeFromWishlist, { isLoading: isRemovingWishlist }] =
    useRemoveFromWishListMutation();

  const [addToAddress, { isLoading: isCreatingAddress }] = useAddToAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [removeAddress, { isLoading: isDeletingAddress }] = useRemoveAddressMutation();
  const [setDefaultAddress] = useDefaultAddressMutation();

  // Local state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    avatarUrl: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Extract data
  const userProfile = profileData?.data;
  const orders = Array.isArray(ordersData?.data?.orders) ? ordersData.data?.orders : [];
  const wishlistItems = Array.isArray(wishlistData?.data?.items) ? wishlistData.data.items : [];
  const addresses = Array.isArray(addressData?.data) ? addressData.data : [];

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      const result = await updateProfile(editFormData).unwrap();
      if (result.success) {
        setIsEditingProfile(false);
        toast({
          title: 'Success',
          description: 'Profile updated successfully!',
        });
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    if (userProfile) {
      setEditFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber || '',
        birthDate: userProfile.birthDate || '',
        avatarUrl: userProfile.avatarUrl || '',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    if (userProfile) {
      setEditFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber || '',
        birthDate: userProfile.birthDate || '',
        avatarUrl: userProfile.avatarUrl || '',
      });
    }
  };

  // Handle wishlist actions
  const handleRemoveFromWishlist = async (id: string) => {
    try {
      const result = await removeFromWishlist(id).unwrap();
      if (result.success) {
        toast({
          title: 'Removed from Wishlist',
          description: 'Item has been removed from your wishlist.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to remove item.',
        variant: 'destructive',
      });
    }
  };

  // Address handlers
  const resetForm = () => {
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  const handleSaveAddress = async (data: AddressFormData) => {
    try {
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
        const result = await updateAddress({
          id: editingAddress.id,
          ...payload,
        }).unwrap();
        if (result.success) {
          toast({
            title: 'Address Updated',
            description: 'Your address has been updated successfully.',
          });
          if (data.isDefault && !editingAddress.default) {
            await setDefaultAddress(editingAddress.id);
          }
        }
      } else {
        const result = await addToAddress(payload).unwrap();
        if (result.success) {
          toast({
            title: 'Address Added',
            description: 'Your new address has been saved.',
          });
          if (data.isDefault && result.data?.id) {
            await setDefaultAddress(result.data.id);
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

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const result = await removeAddress(addressToDelete).unwrap();
      if (result.success) {
        toast({
          title: 'Address Deleted',
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

  // Enhanced order status helpers
  const getStatusConfig = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle2,
          label: 'Delivered',
        };
      case 'shipped':
      case 'shipping':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Truck,
          label: 'Shipped',
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Clock,
          label: 'Pending',
        };
      case 'processing':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: Loader2,
          label: 'Processing',
        };
      case 'cancelled':
      case 'canceled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Cancelled',
        };
      case 'expired':
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: 'Expired',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Package,
          label: status,
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-auto p-1 bg-muted/50">
          <TabsTrigger
            value="orders"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="address"
            className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm py-3"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Address</span>
          </TabsTrigger> */}
        </TabsList>

        {/* Orders Tab - Enhanced Design */}
        <TabsContent value="orders" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-card p-4 rounded-lg border">
              <div>
                <h2 className="text-xl font-semibold">Order History</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track and manage your orders
                </p>
              </div>
              <Badge variant="outline" className="w-fit">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </Badge>
            </div>

            {isLoadingOrders ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start shopping to see your orders here. Your purchase history will appear once you
                  place your first order.
                </p>
                <Link href="/products">
                  <Button variant="street" className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={order.id}
                      className="bg-card rounded-lg border hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Order Header */}
                      <div className="p-6 border-b bg-muted/30">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">
                                Order #{order.orderNumber?.slice(0, 8) || order.id.slice(0, 8)}
                              </h3>
                              <Badge
                                className={`${statusConfig.color} border flex items-center gap-1.5 px-3 py-1`}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                              {order.items?.length > 0 && (
                                <span>
                                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                              <p className="text-2xl font-bold text-foreground">
                                {order.currency || 'EUR'} {(order.totalAmount || order.total)?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="p-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {order.items.slice(0, 3).map((item: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border"
                              >
                                {item.image && (
                                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-background">
                                    <Image
                                      src={item.image}
                                      alt={item.productName || 'Product'}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                    {item.productName || 'Product'}
                                  </h4>
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Qty: {item.quantity}</span>
                                    {item.price && (
                                      <span className="font-medium">
                                        {order.currency || 'EUR'} {item.price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {order.items.length > 3 && (
                            <div className="mt-4 text-center">
                              <span className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full inline-block">
                                +{order.items.length - 3} more{' '}
                                {order.items.length - 3 === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order Actions */}
                      <div className="p-6  flex gap-3">
                        <Link href={`/orders/details/${order.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {(order.status === 'DELIVERED' || order.status === 'delivered') && (
                          <Button variant="street" size="sm" className="flex-1">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Wishlist Tab - Enhanced Design */}
        <TabsContent value="wishlist" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-card p-4 rounded-lg border">
              <div>
                <h2 className="text-xl font-semibold">My Wishlist</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Items you&apos;ve saved for later
                </p>
              </div>
              <Badge variant="outline" className="w-fit">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            {isLoadingWishlist ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-lg" />
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Save items you love to your wishlist and never lose track of them
                </p>
                <Link href="/products">
                  <Button variant="street" className="gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Browse Products
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item: any) => (
                  <div
                    key={item.productId}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-700"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-72 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.productName || 'Product'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Discount Badge */}
                      {item.basePrice && item.basePrice > item.sellingPrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {Math.round(((item.basePrice - item.sellingPrice) / item.basePrice) * 100)}% OFF
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.productId)}
                        disabled={isRemovingWishlist}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 disabled:opacity-50"
                      >
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </button>

                      {/* Stock Badge */}
                      {!item.inStock && (
                        <div className="absolute bottom-3 left-3 bg-gray-900 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      <div className="flex justify-between gap-4 mb-4">
                        {/* Left: Brand and Product Name */}
                        <div className="flex-1 min-w-0">
                          {/* Brand */}
                          {item.brandName && (
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                              {item.brandName}
                            </p>
                          )}

                          {/* Product Name */}
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
                            {item.productName}
                          </h3>
                        </div>

                        {/* Right: Price and Rating */}
                        <div className="flex flex-col items-end justify-start flex-shrink-0">
                          {/* Price */}
                          <div className="text-right mb-2">
                            <div className="text font-bold text-gray-900 dark:text-white whitespace-nowrap">
                              €{item.sellingPrice?.toFixed(2)}
                            </div>
                            {item.basePrice && item.basePrice > item.sellingPrice && (
                              <div className="text-sm text-gray-400 line-through whitespace-nowrap">
                                €{item.basePrice?.toFixed(2)}
                              </div>
                            )}
                          </div>

                          {/* Condition Rating */}
                          {item.conditionRating && (
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-0.5">
                                {[...Array(10)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-3 rounded-sm ${i < item.conditionRating
                                      ? 'bg-green-500'
                                      : 'bg-gray-200 dark:bg-gray-700'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {item.conditionRating}/10
                              </span>
                            </div>
                          )}
                        </div>
                      </div>



                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                          disabled={isRemovingWishlist}
                          className="flex-none px-4 border-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="street"
                          size="sm"
                          asChild
                          disabled={!item.inStock}
                          className="flex-1 font-semibold"
                        >
                          <a href={`/products/${item.productId}`}>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            {item.inStock ? 'View Product' : 'Out of Stock'}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg border">
              <div>
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your account details
                </p>
              </div>
              {!isEditingProfile && userProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditProfile}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            {isLoadingProfile ? (
              <div className="bg-card rounded-lg p-8 border">
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  <span className="ml-3 text-muted-foreground">Loading profile...</span>
                </div>
              </div>
            ) : userProfile ? (
              <div className="bg-card rounded-lg p-6 border">
                {isEditingProfile ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProfileUpdate();
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="edit-firstName">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-firstName"
                          value={editFormData.firstName}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, firstName: e.target.value })
                          }
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-lastName">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="edit-lastName"
                          value={editFormData.lastName}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, lastName: e.target.value })
                          }
                          required
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-email">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editFormData.email}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, email: e.target.value })
                        }
                        required
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editFormData.phoneNumber}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                        }
                        placeholder="+1234567890"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-birthDate">Date of Birth</Label>
                      <Input
                        id="edit-birthDate"
                        type="date"
                        value={editFormData.birthDate}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, birthDate: e.target.value })
                        }
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-avatarUrl">Avatar URL</Label>
                      <Input
                        id="edit-avatarUrl"
                        type="url"
                        value={editFormData.avatarUrl}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, avatarUrl: e.target.value })
                        }
                        placeholder="https://example.com/avatar.png"
                        className="h-11"
                      />
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <Button
                        type="submit"
                        variant="street"
                        size="lg"
                        disabled={isUpdatingProfile}
                        className="flex items-center gap-2"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleCancelEdit}
                        disabled={isUpdatingProfile}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {userProfile.avatarUrl && (
                      <div className="flex justify-center pb-6 border-b">
                        <Image
                          src={userProfile.avatarUrl}
                          alt="Profile"
                          width={100}
                          height={100}
                          className="rounded-full object-cover border-4 border-muted"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          First Name
                        </Label>
                        <p className="text-foreground font-medium text-lg">
                          {userProfile.firstName}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Last Name
                        </Label>
                        <p className="text-foreground font-medium text-lg">
                          {userProfile.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </Label>
                      <p className="text-foreground font-medium text-lg">{userProfile.email}</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </Label>
                      <p className="text-foreground font-medium text-lg">
                        {userProfile.phoneNumber || 'Not provided'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </Label>
                      <p className="text-foreground font-medium text-lg">
                        {userProfile.birthDate
                          ? new Date(userProfile.birthDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : 'Not provided'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </Label>
                      <p className="text-foreground font-medium text-lg">
                        {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-lg p-8 border">
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-6">
                    Failed to load profile information
                  </p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address" className="mt-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-card p-4 rounded-lg border">
              <div>
                <h2 className="text-xl font-semibold">My Addresses</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your shipping and billing addresses
                </p>
              </div>
              {!showAddressForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressForm(true)}
                  className="gap-2 w-fit"
                >
                  <Plus className="w-4 h-4" />
                  Add New Address
                </Button>
              )}
            </div>

            {isLoadingAddress ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            ) : showAddressForm ? (
              <div className="bg-card rounded-lg p-6 border">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                  </h3>
                </div>
                <AddressForm
                  onSubmit={handleSaveAddress}
                  onCancel={resetForm}
                  initialData={getInitialEditData()}
                  isLoading={isCreatingAddress || isUpdatingAddress}
                  isEditing={!!editingAddress}
                  countries={EU_COUNTRIES}
                />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No saved addresses</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add a delivery address to manage your shipping locations
                </p>
                <Button
                  onClick={() => setShowAddressForm(true)}
                  variant="street"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {addresses.map((address: any) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    isSelected={false}
                    onSelect={() => { }}
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
          </div>
        </TabsContent>
      </Tabs>

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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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
  );
};

export default Dashboard;