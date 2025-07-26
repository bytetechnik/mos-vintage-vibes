import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCategory } from '@/types/product';

interface CategoryNavigationProps {
  totalProducts: number;
}

const categoryData = [
  {
    key: 'trackpants-joggers' as ProductCategory,
    label: 'JOGGER',
    icon: '👖',
    description: 'Trackpants & Joggers',
    color: 'bg-blue-100'
  },
  {
    key: 'jackets' as ProductCategory,
    label: 'JACKEN',
    icon: '🧥',
    description: 'Jackets',
    color: 'bg-red-100'
  },
  {
    key: 'tracksuits' as ProductCategory,
    label: 'ANZÜGE',
    icon: '👔',
    description: 'Tracksuits',
    color: 'bg-gray-100'
  },
  {
    key: 'accessories' as ProductCategory,
    label: 'DESIGNER',
    icon: '👜',
    description: 'Accessories',
    color: 'bg-yellow-100'
  },
  {
    key: 'jeans' as ProductCategory,
    label: 'JEANS',
    icon: '👖',
    description: 'Jeans',
    color: 'bg-indigo-100'
  },
  {
    key: 'shirts-polos' as ProductCategory,
    label: 'SHIRTS',
    icon: '👕',
    description: 'Shirts & Polos',
    color: 'bg-green-100'
  },
  {
    key: 'sweaters-hoodies' as ProductCategory,
    label: 'PULLOVER',
    icon: '🧶',
    description: 'Sweaters & Hoodies',
    color: 'bg-purple-100'
  }
];

const CategoryNavigation = ({ totalProducts }: CategoryNavigationProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const currentCategory = searchParams.get('category') as ProductCategory;

  // Sync sortBy with URL params
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  const handleCategoryClick = (category: ProductCategory) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentCategory === category) {
      // If clicking the same category, clear it
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    navigate(`/products?${newParams.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    navigate(`/products?${newParams.toString()}`);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-3 md:p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 order-1 lg:order-1">
          <span className="text-sm font-medium text-gray-700">Sortieren nach</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-32 border-0 bg-transparent p-0 h-auto">
              <SelectValue />
              <ChevronDown className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Neueste</SelectItem>
              <SelectItem value="price-low">Preis: Niedrig zu Hoch</SelectItem>
              <SelectItem value="price-high">Preis: Hoch zu Niedrig</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="condition">Beste Qualität</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Icons */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-2 lg:pb-0 order-3 lg:order-2 flex-1 justify-center lg:justify-start">
          {categoryData.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className={`flex flex-col items-center gap-1 md:gap-2 min-w-[50px] md:min-w-[60px] group ${
                currentCategory === category.key ? 'ring-2 ring-red-500 ring-offset-1 md:ring-offset-2' : ''
              }`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${category.color} flex items-center justify-center text-lg md:text-xl group-hover:bg-red-50 transition-colors ${
                currentCategory === category.key ? 'bg-red-100' : ''
              }`}>
                {category.icon}
              </div>
              <span className={`text-xs font-medium transition-colors text-center ${
                currentCategory === category.key 
                  ? 'text-red-600 font-semibold' 
                  : 'text-gray-700 group-hover:text-red-600'
              }`}>
                {category.label}
              </span>
            </button>
          ))}
        </div>

        {/* Product Count */}
        <div className="text-sm font-medium text-gray-700 whitespace-nowrap order-2 lg:order-3">
          {totalProducts} Produkte
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation; 