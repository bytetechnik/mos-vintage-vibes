import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import NavigationMenu from './NavigationMenu';
import MobileSidebar from './MobileSidebar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

          {/* Right: User only */}
          <div className="flex items-center justify-end flex-1">
            <Link to="/login">
              <Button variant="ghost" size="icon" className="relative">
                <User className={`w-5 h-5 transition-colors duration-300 ${location.pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Header;