import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface NavigationMenuProps {
  isScrolled?: boolean;
}

const NavigationMenu = ({ isScrolled = false }: NavigationMenuProps) => {
  const location = useLocation();
  const kategorien = [
    { name: 'TRACKPANTS', href: '/products?category=trackpants-joggers' },
    { name: 'JACKEN', href: '/products?category=jackets' },
    { name: 'TRACKSUITS', href: '/products?category=tracksuits' },
    { name: 'PULLIS & HOODIES', href: '/products?category=sweaters-hoodies' },
    { name: 'SHIRTS & POLOS', href: '/products?category=shirts-polos' },
    { name: 'JEANS', href: '/products?category=jeans' },
    { name: 'SHORTS', href: '/products?category=trackpants-joggers' },
    { name: 'WESTEN', href: '/products?category=jackets' },
    { name: 'SCHUHE', href: '/products?category=accessories' },
    { name: 'ACCESSOIRES', href: '/products?category=accessories' }
  ];

  const groessen = [
    { name: 'FRAUEN', href: '/products?size=FRAUEN' },
    { name: 'KINDER', href: '/products?size=KINDER' },
    { name: 'XS', href: '/products?size=XS' },
    { name: 'S', href: '/products?size=S' },
    { name: 'M', href: '/products?size=M' },
    { name: 'L', href: '/products?size=L' },
    { name: 'XL', href: '/products?size=XL' },
    { name: 'XXL', href: '/products?size=XXL' }
  ];

  const textColor = location.pathname === '/' ? (isScrolled ? 'text-black' : 'text-white') : 'text-black';
  
  return (
    <nav className="hidden md:flex items-center space-x-4 ml-0">
      <Link 
        to="/" 
        className={`text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}
      >
        HOME
      </Link>
      
      <Link 
        to="/products" 
        className={`text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}
      >
        VERFÜGBAR
      </Link>
      
      <Link 
        to="/latest-drops" 
        className={`text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}
      >
        LATEST DROPS
      </Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}>
          KATEGORIEN
          <ChevronDown className="ml-1 h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {kategorien.map((item) => (
            <DropdownMenuItem key={item.name} asChild>
              <Link to={item.href} className="w-full">
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger className={`flex items-center text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}>
          GRÖßEN
          <ChevronDown className="ml-1 h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {groessen.map((item) => (
            <DropdownMenuItem key={item.name} asChild>
              <Link to={item.href} className="w-full">
                {item.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Link 
        to="/gift-cards" 
        className={`text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}
      >
        GUTSCHEINKARTEN
      </Link>
      
      <Link 
        to="/archive" 
        className={`text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}
      >
        ARCHIVE
      </Link>
    </nav>
  );
};

export default NavigationMenu; 