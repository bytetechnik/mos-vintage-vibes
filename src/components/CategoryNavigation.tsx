import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCategory } from '@/types/product';
import joggerImg from '@/assets/categoryicon/jogger.avif';
import jackenImg from '@/assets/categoryicon/Jacken.avif';
import anzugeImg from '@/assets/categoryicon/anzuge.avif';
import designerImg from '@/assets/categoryicon/designer.avif';
import jeansImg from '@/assets/categoryicon/jeans.avif';
import shirtsImg from '@/assets/categoryicon/shirts.avif';
import pulloverImg from '@/assets/categoryicon/Pullover.avif';

interface CategoryNavigationProps {
  totalProducts: number;
}

const categoryData = [
  {
    key: 'trackpants-joggers' as ProductCategory,
    label: 'JOGGER',
    icon: joggerImg,
    description: 'Trackpants & Joggers',
    color: 'bg-blue-100'
  },
  {
    key: 'jackets' as ProductCategory,
    label: 'JACKEN',
    icon: jackenImg,
    description: 'Jackets',
    color: 'bg-red-100'
  },
  {
    key: 'tracksuits' as ProductCategory,
    label: 'ANZÜGE',
    icon: anzugeImg,
    description: 'Tracksuits',
    color: 'bg-gray-100'
  },
  {
    key: 'accessories' as ProductCategory,
    label: 'DESIGNER',
    icon: designerImg,
    description: 'Accessories',
    color: 'bg-yellow-100'
  },
  {
    key: 'jeans' as ProductCategory,
    label: 'JEANS',
    icon: jeansImg,
    description: 'Jeans',
    color: 'bg-indigo-100'
  },
  {
    key: 'shirts-polos' as ProductCategory,
    label: 'SHIRTS',
    icon: shirtsImg,
    description: 'Shirts & Polos',
    color: 'bg-green-100'
  },
  {
    key: 'sweaters-hoodies' as ProductCategory,
    label: 'PULLOVER',
    icon: pulloverImg,
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
    <div className="flex flex-col items-center gap-3 md:gap-4 mb-6 w-full">
      {/* Category Icons - Mobile: Horizontal Scrollable, Desktop: Original Design */}
      <div className="flex items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8 overflow-x-auto pb-2 lg:pb-0 justify-start sm:justify-center w-full px-2 sm:px-0">
        {categoryData.map((category) => (
          <button
            key={category.key}
            onClick={() => handleCategoryClick(category.key)}
            className="flex flex-col items-center gap-1 md:gap-2 min-w-[70px] sm:min-w-[80px] md:min-w-[90px] group flex-shrink-0"
          >
            {/* Mobile: Minimalistic design, Desktop: Original design */}
            <div className={`rounded-full flex items-center justify-center border-4 transition-all duration-200
              /* Mobile styles */
              w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20
              /* Mobile: Orange borders, Desktop: Original blue borders */
              border-orange-300 md:border-[#00bfff]
              /* Mobile: Orange hover, Desktop: Original hover */
              hover:border-orange-400 md:hover:border-blue-500
              /* Mobile: Orange active, Desktop: Original active */
              ${currentCategory === category.key 
                ? 'border-orange-400 md:border-blue-600 shadow-lg scale-105' 
                : ''
              }
            `}>
              <img 
                src={category.icon} 
                alt={category.label} 
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full" 
              />
            </div>
            <span className={`text-sm sm:text-base font-medium transition-colors text-center
              /* Mobile: Orange text, Desktop: Original blue text */
              ${currentCategory === category.key 
                ? 'text-orange-600 md:text-blue-600 font-semibold' 
                : 'text-gray-700 group-hover:text-orange-600 md:group-hover:text-blue-600'
              }
            `}>
              {category.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavigation; 