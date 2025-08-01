import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import NavigationMenu from './NavigationMenu';
import MobileSidebar from './MobileSidebar';
import SearchAutocomplete from './SearchAutocomplete';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof products>([]);
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

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
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
    setSearchResults(results);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-center h-8 sm:h-10 px-2 sm:px-4">
          <p className={`text-xs sm:text-sm font-medium transition-colors duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
            isScrolled ? 'text-foreground' : 'text-gray-900'
          }`}>
            KOSTENLOSER VERSAND FÜR BESTELLUNGEN &gt; 150€!
          </p>
        </div>
      </div>

      <header className={`fixed top-8 sm:top-10 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
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
              <Menu className={`w-6 h-6 transition-colors duration-300 ${location.pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
            </Button>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center flex-1">
            <Link to="/" className="flex items-center">
              <img 
                src="/logo_white.png" 
                alt="Mo's VintageWorld Logo" 
                className="w-48 h-48 md:w-56 md:h-56 sm:w-40 sm:h-40 object-contain"
              />
            </Link>
          </div>

          {/* Right: Search and Cart */}
          <div className="flex items-center justify-end flex-1 space-x-2">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className={`w-5 h-5 transition-colors duration-300 ${location.pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
            </Button>
            
            {/* Cart Button */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className={`w-5 h-5 transition-colors duration-300 ${location.pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vintage-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </Link>
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
                    setSearchQuery('');
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="p-4 flex-shrink-0">
                <SearchAutocomplete
                  onSearch={(query) => {
                    navigate(`/products?search=${encodeURIComponent(query)}`);
                    setIsSearchOpen(false);
                  }}
                  onProductSelect={(product) => {
                    navigate(`/product/${product.id}`);
                    setIsSearchOpen(false);
                  }}
                  placeholder="Search for products, brands, categories..."
                  className="w-full"
                />
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto min-h-0 p-4">
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
                          <img
                            src={product.images[0]}
                            alt={product.name}
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
                              navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Header;