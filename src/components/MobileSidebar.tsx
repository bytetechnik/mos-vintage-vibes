import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [expandedCategories, setExpandedCategories] = useState(false);
  const [expandedSizes, setExpandedSizes] = useState(false);

  // Updated categories to match actual product categories
  const kategorien = [
    { name: 'TRACKPANTS', href: '/products?category=trackpants' },
    { name: 'JACKEN', href: '/products?category=jackets' },
    { name: 'TRACKSUITS', href: '/products?category=tracksuits' },
    { name: 'PULLIS & HOODIES', href: '/products?category=hoodies' },
    { name: 'SHIRTS & POLOS', href: '/products?category=shirts' },
    { name: 'JEANS', href: '/products?category=jeans' },
    { name: 'SHORTS', href: '/products?category=shorts' },
    { name: 'WESTEN', href: '/products?category=vests' },
    { name: 'SCHUHE', href: '/products?category=shoes' },
    { name: 'ACCESSOIRES', href: '/products?category=accessories' }
  ];

  // Updated sizes to match actual size filters
  const groessen = [
    { name: 'FRAUEN', href: '/products?gender=women' },
    { name: 'KINDER', href: '/products?gender=kids' },
    { name: 'XS', href: '/products?size=xs' },
    { name: 'S', href: '/products?size=s' },
    { name: 'M', href: '/products?size=m' },
    { name: 'L', href: '/products?size=l' },
    { name: 'XL', href: '/products?size=xl' },
    { name: 'XXL', href: '/products?size=xxl' }
  ];

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle swipe to close
  useEffect(() => {
    if (!isOpen || !sidebarRef.current) return;

    let startX = 0;
    let currentX = 0;
    const sidebar = sidebarRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      
      if (diff > 50) { // Swipe left to close
        onClose();
      }
    };

    sidebar.addEventListener('touchstart', handleTouchStart);
    sidebar.addEventListener('touchmove', handleTouchMove);

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, onClose]);

  const handleLinkClick = () => {
    onClose();
  };

  const toggleCategories = () => {
    setExpandedCategories(!expandedCategories);
  };

  const toggleSizes = () => {
    setExpandedSizes(!expandedSizes);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-all duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          boxShadow: isOpen ? '0 0 40px rgba(0,0,0,0.3)' : 'none'
        }}
      >
        {/* Header with Logo Banner - Fixed at top */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0 pt-20 pb-8">
          <div className="relative flex items-center justify-center min-h-[80px]">
            <img 
              src="/logo_white.png" 
              alt="Mo's VintageWorld Logo" 
              className="w-3/4 object-contain"
            />
            {/* Close button hidden */}
            {/* <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100 text-gray-600 absolute right-4 top-4"
            >
              <X className="w-5 h-5" />
            </Button> */}
          </div>
        </div>

        {/* Navigation Menu - Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="p-6 space-y-6">
            {/* Main Navigation */}
            <div className="space-y-4">
              <Link 
                to="/" 
                className="block text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={handleLinkClick}
              >
                HOME
              </Link>
              
              <Link 
                to="/products" 
                className="block text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={handleLinkClick}
              >
                VERFÜGBAR
              </Link>
              
              <Link 
                to="/latest-drops" 
                className="block text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={handleLinkClick}
              >
                LETZTER DROP
              </Link>
            </div>

            {/* Categories Section */}
            <div className="space-y-2">
              <button
                onClick={toggleCategories}
                className="flex items-center justify-between w-full text-lg font-semibold text-black hover:text-gray-600 transition-colors"
              >
                <span>KATEGORIEN</span>
                {expandedCategories ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
              
              {expandedCategories && (
                <div className="ml-4 space-y-2 mt-3">
                  {kategorien.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-sm text-gray-600 hover:text-black transition-colors"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes Section */}
            <div className="space-y-2">
              <button
                onClick={toggleSizes}
                className="flex items-center justify-between w-full text-lg font-semibold text-black hover:text-gray-600 transition-colors"
              >
                <span>GRÖßEN</span>
                {expandedSizes ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
              
              {expandedSizes && (
                <div className="ml-4 space-y-2 mt-3">
                  {groessen.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-sm text-gray-600 hover:text-black transition-colors"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Links */}
            <div className="space-y-4">
              <Link 
                to="/gift-cards" 
                className="block text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={handleLinkClick}
              >
                GUTSCHEINKARTEN
              </Link>
              
              <Link 
                to="/archive" 
                className="block text-lg font-semibold text-black hover:text-gray-600 transition-colors"
                onClick={handleLinkClick}
              >
                ARCHIVE
              </Link>
            </div>

            {/* Bottom Links */}
            <div className="pt-6 space-y-3 border-t border-gray-100">
              <Link 
                to="/login" 
                className="block text-sm text-gray-600 hover:text-black transition-colors"
                onClick={handleLinkClick}
              >
                Login
              </Link>
              
              <Link 
                to="/register" 
                className="block text-sm text-gray-600 hover:text-black transition-colors"
                onClick={handleLinkClick}
              >
                Account erstellen
              </Link>
              
              <Link 
                to="/search" 
                className="block text-sm text-gray-600 hover:text-black transition-colors"
                onClick={handleLinkClick}
              >
                Suche
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar; 