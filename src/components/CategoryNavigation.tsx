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
    <div className="flex flex-col items-center gap-4 mb-6 w-full max-w-full">
      {/* Category Icons - Horizontal Scrollable */}
      <div className="w-full max-w-full overflow-hidden">
        <div 
          className="flex items-center gap-4 overflow-x-auto pb-3 px-4 sm:justify-center md:justify-center"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {categoryData.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0 p-1 transition-all duration-200 active:scale-95"
            >
              {/* Category Icon Circle */}
              <div className={`
                rounded-full flex items-center justify-center border-3 transition-all duration-200
                w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20
                ${currentCategory === category.key 
                  ? 'border-orange-400 shadow-lg scale-105' 
                  : 'border-orange-300 hover:border-orange-400'
                }
                shadow-sm hover:shadow-md
              `}>
                <img 
                  src={category.icon} 
                  alt={category.label} 
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full" 
                />
              </div>
              
              {/* Category Label */}
              <span className={`
                text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap
                ${currentCategory === category.key 
                  ? 'text-orange-600 font-semibold' 
                  : 'text-gray-700 hover:text-orange-600'
                }
              `}>
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;