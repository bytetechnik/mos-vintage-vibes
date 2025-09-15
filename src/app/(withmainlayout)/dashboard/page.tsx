/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { products } from '@/data/products';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import { UpdateProfileRequest, UserProfile } from '@/types/api';
import { Bell, Check, CreditCard, Edit3, Heart, Loader2, MapPin, Package, Settings, User, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    avatarUrl: ''
  });

  const [address, setAddress] = useState({
    street: 'Musterstraße 123',
    city: 'Berlin',
    postalCode: '10115',
    country: 'Germany'
  });

  const { toast } = useToast();

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);

      // Simulated response
      const response = {
        success: true,
        data: {
          id: "1",
          firstName: "Saiful",
          lastName: "Islam Shanto",
          email: "shanto@example.com",
          phoneNumber: "+8801712345678",
          birthDate: "1998-06-15",
          avatarUrl: "/images/profile-avatar.png",
          status: "active",
          createdAt: "2024-09-15T10:00:00Z",
          addresses: [], // or a mock address object if needed
        },
      };

      if (response.success) {
        setUserProfile(response.data);
        // Initialize edit form data
        setEditFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          birthDate: response.data.birthDate,
          avatarUrl: response.data.avatarUrl,
        });
      }
    } catch (error: any) {
      console.error("Failed to load user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };


  const handleProfileUpdate = async () => {
    try {
      setIsUpdatingProfile(true);
      const response = await apiService.updateUserProfile(editFormData);
      if (response.success) {
        setUserProfile(response.data);
        setIsEditingProfile(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    // Reset edit form data to current profile values
    if (userProfile) {
      setEditFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber || '',
        birthDate: userProfile.birthDate || '',
        avatarUrl: userProfile.avatarUrl || ''
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset edit form data to current profile values
    if (userProfile) {
      setEditFormData({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber || '',
        birthDate: userProfile.birthDate || '',
        avatarUrl: userProfile.avatarUrl || ''
      });
    }
  };

  // Mock order data
  const orders = [
    {
      id: 'MV-ABC123DEF',
      date: '2024-01-20',
      status: 'delivered' as const,
      total: 89.99,
      items: [products[0]]
    },
    {
      id: 'MV-XYZ789GHI',
      date: '2024-01-15',
      status: 'shipped' as const,
      total: 65.00,
      items: [products[1]]
    },
    {
      id: 'MV-JKL456MNO',
      date: '2024-01-10',
      status: 'pending' as const,
      total: 320.00,
      items: [products[5]]
    }
  ];

  // Mock wishlist data
  const wishlistItems = products.slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'pending': return 'Processing';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Account</h1>
        <p className="text-muted-foreground">Manage your profile, orders, and preferences</p>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order History</h2>
              <Badge variant="outline">{orders.length} orders</Badge>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-card rounded-lg p-6 shadow-card-custom">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Order {order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <span className="font-semibold">€{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          width={48}   // w-12 = 48px
                          height={48}  // h-12 = 48px
                          className="object-cover rounded"
                        />

                        <div>
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.brand}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Wishlist</h2>
              <Badge variant="outline">{wishlistItems.length} items</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-card rounded-lg overflow-hidden shadow-card-custom">
                  <div className="relative w-full h-48">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.brand}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">€{item.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                        <Button variant="vintage" size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  <form onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-firstName">First Name</Label>
                        <Input
                          id="edit-firstName"
                          value={editFormData.firstName}
                          onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-lastName">Last Name</Label>
                        <Input
                          id="edit-lastName"
                          value={editFormData.lastName}
                          onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-email">Email Address</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-phone">Phone Number</Label>
                      <Input
                        id="edit-phone"
                        type="tel"
                        value={editFormData.phoneNumber}
                        onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                        placeholder="+1234567890"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-birthDate">Date of Birth</Label>
                      <Input
                        id="edit-birthDate"
                        type="date"
                        value={editFormData.birthDate}
                        onChange={(e) => setEditFormData({ ...editFormData, birthDate: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-avatarUrl">Avatar URL</Label>
                      <Input
                        id="edit-avatarUrl"
                        type="url"
                        value={editFormData.avatarUrl}
                        onChange={(e) => setEditFormData({ ...editFormData, avatarUrl: e.target.value })}
                        placeholder="https://example.com/avatar.png"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        variant="street"
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
                        <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                        <p className="text-foreground font-medium">{userProfile.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                        <p className="text-foreground font-medium">{userProfile.lastName}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                      <p className="text-foreground font-medium">{userProfile.email}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                      <p className="text-foreground font-medium">
                        {userProfile.phoneNumber || 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                      <p className="text-foreground font-medium">
                        {userProfile.birthDate ? new Date(userProfile.birthDate).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                      <p className="text-foreground font-medium">
                        {new Date(userProfile.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {userProfile.avatarUrl && (
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Profile Picture</Label>
                        <div className="mt-2">
                          <Image
                            src={userProfile.avatarUrl}
                            alt="Profile"
                            width={80}   // w-20 = 80px
                            height={80}  // h-20 = 80px
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
                  <p className="text-muted-foreground mb-4">Failed to load profile information</p>
                  <Button variant="outline" onClick={loadUserProfile}>
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
            <h2 className="text-xl font-semibold">Shipping Address</h2>

            <div className="bg-card rounded-lg p-6 shadow-card-custom">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  />
                </div>

                <Button variant="street">Save Address</Button>
              </form>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-xl font-semibold">Account Settings</h2>

            {/* Notifications */}
            <div className="bg-card rounded-lg p-6 shadow-card-custom">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span>Order updates</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span>New arrivals</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Sales & promotions</span>
                  <input type="checkbox" className="toggle" />
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card rounded-lg p-6 shadow-card-custom">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Security
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card rounded-lg p-6 shadow-card-custom border-destructive/20">
              <h3 className="font-semibold mb-4 text-destructive">Danger Zone</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-destructive border-destructive/20 hover:bg-destructive/10">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;