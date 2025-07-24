import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

const FloatingCartButton = () => {
  const { items } = useCart();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <Link to="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-6 right-6 z-50 shadow-lg bg-vintage-orange text-white hover:bg-vintage-orange/90 transition-all duration-300"
        style={{ borderRadius: '50%', width: '56px', height: '56px' }}
      >
        <ShoppingCart className="w-7 h-7" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-white text-vintage-orange border border-vintage-orange">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default FloatingCartButton; 