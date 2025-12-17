"use client";
import { Button } from '@/components/ui/button';
// import { products } from '@/data/products';
import { useCartsQuery } from '@/redux/api/cartApi';
import { getUserInfo, logoutUser } from '@/services/auth.service';
import { CartResponse } from '@/types/cart';
import { isAuthenticated } from '@/utils/auth-helpers';
import { LogOut, Menu, Settings, ShoppingCart, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import MobileSidebar from './nav/MobileSidebar';
import NavigationMenu from './nav/NavigationMenu';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [searchResults, setSearchResults] = useState<typeof products>([]);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setIsAuthenticatedState(authStatus);

      if (authStatus) {
        const userData = getUserInfo();
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., login in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const pathname = usePathname();
  // const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  // Search functionality
  // useEffect(() => {
  //   if (searchQuery.trim() === '') {
  //     setSearchResults([]);
  //     return;
  //   }

  //   const query = searchQuery.toLowerCase();
  //   const results = products.filter(product =>
  //     product.name.toLowerCase().includes(query)
  //     // product.brand.toLowerCase().includes(query) ||
  //     // product.category.toLowerCase().includes(query) ||
  //     // product.tags.some(tag => tag.toLowerCase().includes(query))
  //   );
  //   setSearchResults(results);
  // }, [searchQuery]);

  // const handleProductClick = (productId: string) => {
  //   router.push(`/products/${productId}`);
  //   setIsSearchOpen(false);
  //   setSearchQuery('');
  // };

  // Only fetch cart data if authenticated
  const { data: cartItemsData } = useCartsQuery({}, {
    skip: !isAuthenticatedState
  });

  const cartData = useMemo(() => (cartItemsData as CartResponse)?.data ?? [], [cartItemsData]);
  const cartItemCount = isAuthenticatedState ? (cartData?.items?.length || 0) : 0;

  return (
    <>
      {/* Announcement Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border'
        : 'bg-white border-b border-gray-200'
        }`}>
        <div className="flex items-center justify-center h-8 sm:h-10 px-2 sm:px-4">
          <p className={`text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${isScrolled ? 'text-foreground' : 'text-gray-900'
            }`}>
            KOSTENLOSER VERSAND FÜR BESTELLUNGEN &gt; 150€!
          </p>
        </div>
      </div>

      <header className={`fixed top-8 sm:top-10 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
        ? 'bg-background/95 backdrop-blur-md border-b border-border'
        : 'bg-transparent'
        }`}>
        <div className="flex items-center h-16 px-4">
          {/* Left: Navigation Menu */}
          <div className="flex items-center flex-1">
            <NavigationMenu isScrolled={isScrolled} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-4"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className={`w-6 h-6 transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1">
            <Link href="/" className="flex items-center">
              <Image src="/logo_white.png" alt="Mo's VintageWorld Logo" width={224} height={224} className="w-48 h-48 md:w-56 md:h-56 sm:w-40 sm:h-40 object-contain" />
            </Link>
          </div>

          {/* Right: Search, Cart, and Profile/Login */}
          <div className="flex items-center justify-end flex-1 space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              {/* <Search className={`w-5 h-5 transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} /> */}
            </Button>

            {/* Cart Button */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className={`w-5 h-5 transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vintage-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Profile/Login Button - Hidden on mobile */}
            <div className="hidden md:block">
              {isAuthenticatedState ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 px-3"
                    >
                      <User className={`w-4 h-4 transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
                      <span className={`hidden sm:inline transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`}>
                        {user?.firstName || 'Profile'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="flex items-center gap-2 p-2">
                      <div className="w-8 h-8 bg-vintage-orange rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={logoutUser}
                      className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-3"
                  >
                    <User className={`w-4 h-4 transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
                    <span className={`hidden sm:inline transition-colors duration-300 ${pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`}>
                      Login
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-2 sm:pt-4 md:pt-8 lg:pt-20 px-2 sm:px-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl h-[95vh] sm:h-[90vh] md:h-[80vh] flex flex-col overflow-hidden">
              {/* Search Header */}
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
                <h2 className="text-lg font-semibold">Search Products</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchOpen(false);
                    // setSearchQuery('');
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="p-4 flex-shrink-0">
                {/* <SearchAutocomplete
                  onSearch={(query) => {
                    router.push(`/products?search=${encodeURIComponent(query)}`);
                    setIsSearchOpen(false);
                  }}
                  onProductSelect={(product) => {
                    router.push(`/products/${product.id}`);
                    setIsSearchOpen(false);
                  }}
                  placeholder="Search for products, brands, categories..."
                  className="w-full"
                /> */}
              </div>

              {/* Search Results */}
              {/* <div className="flex-1 overflow-y-auto min-h-0 p-4">
                {searchQuery.trim() === '' ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">Start typing to search for products</p>
                    <p className="text-sm text-muted-foreground mt-2">Search by brand, category, or product name</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-sm text-muted-foreground font-medium">
                      Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    <div className="space-y-3">
                      {searchResults.slice(0, 15).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-transparent hover:border-border"
                        >
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate text-base">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.brand} • €{product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {searchResults.length > 15 && (
                        <div className="pt-2 border-t">
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                          >
                            View all {searchResults.length} results
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div> */}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        user={user}
        isAuthenticated={isAuthenticatedState}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default NavBar;