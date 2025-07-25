import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative">
          {/* Left: Hamburger menu */}
          <div className="flex items-center">
            <SidebarTrigger
              className={`mr-4 transition-colors duration-300 ${isScrolled ? 'bg-white text-black' : 'bg-black text-white'}`}
              style={{ borderRadius: '8px' }}
            >
              <Menu className={`w-6 h-6 transition-colors duration-300 ${isScrolled ? 'text-black' : 'text-white'}`} />
            </SidebarTrigger>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-20 md:bottom-[-48px] sm:bottom-[-40px] bottom-[-56px]" style={{}}>
            <Link to="/" className="flex items-center">
              <img 
                src="/logo.jpeg" 
                alt="Mo's VintageWorld Logo" 
                className="w-24 h-24 md:w-24 md:h-24 sm:w-16 sm:h-16 w-12 h-12 object-contain shadow-lg rounded-none bg-white"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
              />
            </Link>
          </div>

          {/* Right: User only */}
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="icon" className="relative">
                <User className={`w-5 h-5 transition-colors duration-300 ${location.pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black'}`} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;