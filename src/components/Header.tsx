import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import NavigationMenu from './NavigationMenu';
import MobileSidebar from './MobileSidebar';

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
        <div className="flex items-center justify-center h-10 px-4">
          <p className={`text-sm font-medium transition-colors duration-300 ${
            isScrolled ? 'text-foreground' : 'text-gray-900'
          }`}>
            KOSTENLOSER VERSAND FÜR BESTELLUNGEN &gt; 150€!
          </p>
        </div>
      </div>

      <header className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${
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
                src="/logo.jpeg" 
                alt="Mo's VintageWorld Logo" 
                className="w-12 h-12 md:w-14 md:h-14 sm:w-10 sm:h-10 object-contain"
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
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
              {/* Search Header */}
              <div className="flex items-center justify-between p-4 border-b">
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
              <div className="p-4">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search for products, brands, categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="pl-10 pr-4 py-3 text-lg"
                      autoFocus
                    />
                  </div>
                </form>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto max-h-96">
                {searchQuery.trim() === '' ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Start typing to search for products
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No products found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="mb-4 text-sm text-muted-foreground">
                      Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    <div className="space-y-2">
                      {searchResults.slice(0, 10).map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {product.brand} • €{product.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {searchResults.length > 10 && (
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