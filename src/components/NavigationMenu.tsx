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
    { name: 'TRACKPANTS', href: '/trackpants' },
    { name: 'JACKEN', href: '/jackets' },
    { name: 'TRACKSUITS', href: '/tracksuits' },
    { name: 'PULLIS & HOODIES', href: '/hoodies' },
    { name: 'SHIRTS & POLOS', href: '/shirts' },
    { name: 'JEANS', href: '/jeans' },
    { name: 'SHORTS', href: '/shorts' },
    { name: 'WESTEN', href: '/vests' },
    { name: 'SCHUHE', href: '/shoes' },
    { name: 'ACCESSOIRES', href: '/accessories' }
  ];

  const groessen = [
    { name: 'FRAUEN', href: '/women' },
    { name: 'KINDER', href: '/kids' },
    { name: 'XS', href: '/xs' },
    { name: 'S', href: '/s' },
    { name: 'M', href: '/m' },
    { name: 'L', href: '/l' },
    { name: 'XL', href: '/xl' },
    { name: 'XXL', href: '/xxl' }
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
        to="/last-drop" 
        className={`text-xs font-medium hover:text-vintage-orange transition-colors ${textColor}`}
      >
        LETZTER DROP
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