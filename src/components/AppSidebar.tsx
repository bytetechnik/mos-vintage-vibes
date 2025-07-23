import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

const AppSidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setOpenMobile(false);
    }
  };

  const categories = [
    { name: 'All Products', path: '/products' },
    { name: 'Sweaters & Hoodies', path: '/products?category=sweaters-hoodies' },
    { name: 'Jeans', path: '/products?category=jeans' },
    { name: 'Jackets', path: '/products?category=jackets' },
    { name: 'Shirts & Polos', path: '/products?category=shirts-polos' },
    { name: 'Trackpants & Joggers', path: '/products?category=trackpants-joggers' },
    { name: 'Accessories', path: '/products?category=accessories' },
    { name: 'Tracksuits', path: '/products?category=tracksuits' },
  ];

  return (
    <Sidebar side="left" className="border-r border-border">
      <SidebarContent className="p-6">
        {/* Logo Section */}
        <div className="mb-8">
          <Link to="/" className="flex items-center justify-center" onClick={() => setOpenMobile(false)}>
            <img 
              src="/logo.jpeg" 
              alt="Mo's VintageWorld Logo" 
              className="w-16 h-16 object-contain rounded-lg"
            />
          </Link>
          <h2 className="text-center mt-3 text-lg font-bold text-foreground">Mo's VintageWorld</h2>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search streetwear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </form>
        </div>

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground font-semibold mb-4">Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {categories.map((category) => (
                <SidebarMenuItem key={category.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={category.path}
                      className="w-full text-left py-3 px-4 rounded-lg hover:bg-muted transition-colors text-foreground hover:text-vintage-orange"
                      onClick={() => setOpenMobile(false)}
                    >
                      {category.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;