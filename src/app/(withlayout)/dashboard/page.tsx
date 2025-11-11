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
import { useAddToCartMutation } from '@/redux/api/cartApi';
import { useOrdersQuery } from '@/redux/api/orderApi';
import { useProfileQuery, useUpdateProfileMutation } from '@/redux/api/userApi';
import { useRemoveFromWishListMutation, useWhishlistQuery } from '@/redux/api/wishList';

import { AddressFormData } from '@/schemas/address';
import { UpdateProfileRequest } from '@/types/api';
import {
  Check,
  Edit3,
  Heart,
  Loader2,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';



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
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
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
  const orders = Array.isArray(ordersData?.data) ? ordersData.data : [];
  const wishlistItems = Array.isArray(wishlistData?.data) ? wishlistData.data : [];
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

  const handleAddToCart = async (productId: string, variantId: string) => {
    try {
      const result = await addToCart({
        productId,
        variantId,
        quantity: 1,
      }).unwrap();

      if (result.success) {
        toast({
          title: 'Added to Cart',
          description: 'Item has been added to your cart.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.data?.message || 'Failed to add to cart.',
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

  // Order status helpers
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'pending':
      case 'processing':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="w-full grid-cols-4">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Address</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order History</h2>
              <Badge variant="outline">{orders.length} orders</Badge>
            </div>

            {isLoadingOrders ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg shadow-card-custom">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start shopping to see your orders here
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
                {orders.map((order: any) => (
                  <div key={order.id} className="bg-card rounded-lg p-6 shadow-card-custom">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Order #{order.orderNumber || order.id}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-2 md:mt-0">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                        <span className="font-semibold">
                          {order.currency} {order.total?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="flex items-center gap-4 flex-wrap">
                        {order.items.slice(0, 3).map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.productName || 'Product'}
                                width={48}
                                height={48}
                                className="object-cover rounded"
                              />
                            )}
                            <div>
                              <h4 className="font-medium text-sm line-clamp-1">
                                {item.productName}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-muted-foreground">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Wishlist</h2>
              <Badge variant="outline">{wishlistItems.length} items</Badge>
            </div>

            {isLoadingWishlist ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))}
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg shadow-card-custom">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Save items you love to your wishlist
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
                    key={item.id}
                    className="bg-card rounded-lg overflow-hidden shadow-card-custom"
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={item.product?.images?.[0] || item.image || '/placeholder.png'}
                        alt={item.product?.name || item.productName || 'Product'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                        {item.product?.name || item.productName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product?.brand || item.brand || ''}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {item.product?.currency || 'EUR'}{' '}
                          {item.product?.price?.toFixed(2) || item.price?.toFixed(2)}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            disabled={isRemovingWishlist}
                          >
                            Remove
                          </Button>
                          <Button
                            variant="vintage"
                            size="sm"
                            onClick={() =>
                              handleAddToCart(
                                item.productId || item.product?.id,
                                item.variantId || item.product?.variants?.[0]?.id
                              )
                            }
                            disabled={isAddingToCart}
                          >
                            Add to Cart
                          </Button>
                        </div>
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
          <div className="max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Personal Information</h2>
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
              <div className="bg-card rounded-lg p-6 shadow-card-custom">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading profile...</span>
                </div>
              </div>
            ) : userProfile ? (
              <div className="bg-card rounded-lg p-6 shadow-card-custom">
                {isEditingProfile ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProfileUpdate();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
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
                        />
                      </div>
                      <div>
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
                        />
                      </div>
                    </div>

                    <div>
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
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editFormData.phoneNumber}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, phoneNumber: e.target.value })
                        }
                        placeholder="+1234567890"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-birthDate">Date of Birth</Label>
                      <Input
                        id="edit-birthDate"
                        type="date"
                        value={editFormData.birthDate}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, birthDate: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-avatarUrl">Avatar URL</Label>
                      <Input
                        id="edit-avatarUrl"
                        type="url"
                        value={editFormData.avatarUrl}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, avatarUrl: e.target.value })
                        }
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
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
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          First Name
                        </Label>
                        <p className="text-foreground font-medium">{userProfile.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Last Name
                        </Label>
                        <p className="text-foreground font-medium">{userProfile.lastName}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </Label>
                      <p className="text-foreground font-medium">{userProfile.email}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Phone Number
                      </Label>
                      <p className="text-foreground font-medium">
                        {userProfile.phoneNumber || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Date of Birth
                      </Label>
                      <p className="text-foreground font-medium">
                        {userProfile.birthDate
                          ? new Date(userProfile.birthDate).toLocaleDateString()
                          : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </Label>
                      <p className="text-foreground font-medium">
                        {new Date(userProfile.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {userProfile.avatarUrl && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Profile Picture
                        </Label>
                        <div className="mt-2">
                          <Image
                            src={userProfile.avatarUrl}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full object-cover border-2 border-border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-lg p-6 shadow-card-custom">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
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
          <div className="max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Addresses</h2>
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

            {isLoadingAddress ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : showAddressForm ? (
              <div className="bg-card rounded-lg p-6 shadow-card-custom">
                <AddressForm
                  onSubmit={handleSaveAddress}
                  onCancel={resetForm}
                  initialData={getInitialEditData()}
                  isLoading={isCreatingAddress || isUpdatingAddress}
                  isEditing={!!editingAddress}
                />
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg shadow-card-custom">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">No saved addresses</h3>
                <p className="text-muted-foreground mb-6">
                  Add a delivery address to manage your shipping
                </p>
                <Button onClick={() => setShowAddressForm(true)} variant="street" className="gap-2">
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
  );
};

export default Dashboard;