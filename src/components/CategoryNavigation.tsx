'use client'

import { useCategoriesQuery } from '@/redux/api/categoriesApi';
import { ProductCategory } from '@/types/product';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface CategoryNavigationProps {
  totalProducts: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CategoryNavigation = ({ totalProducts }: CategoryNavigationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const currentCategory = searchParams.get('category') as ProductCategory;

  const { data } = useCategoriesQuery({})
  const rawCategories = data?.data || []

  // Filter and map API data to component format
  // Only show active categories and sort by sortOrder
  const categoryData = rawCategories
    .filter((cat: any) => cat.isActive)
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    .map((cat: any) => ({
      key: cat.slug,
      label: cat.name,
      icon: cat.imageUrl || '/placeholder-category.png', // Fallback image
      id: cat.id
    }));

  // Function to update URL params
  const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`${pathname}${query}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Sync sortBy with URL params
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam && sortParam !== sortBy) {
      setSortBy(sortParam);
    }
  }, [searchParams, sortBy]);

  const handleCategoryClick = (category: ProductCategory) => {
    if (currentCategory === category) {
      // If clicking the same category, clear it
      updateSearchParams({ category: null });
    } else {
      updateSearchParams({ category });
    }
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

          {categoryData.map((category: any) => (
            <button
              key={category.key}
              onClick={() => handleCategoryClick(category.key)}
              className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0 p-1 transition-all duration-200 active:scale-95"
            >
              {/* Category Icon Circle */}
              <div
                className={`
                  rounded-full flex items-center justify-center border-3 transition-all duration-200
                  w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 relative overflow-hidden
                  ${currentCategory === category.key
                    ? 'shadow-lg scale-105'
                    : 'hover:scale-105'
                  }
                  shadow-sm hover:shadow-md
                `}
                style={{
                  border: '3px solid transparent',
                  backgroundImage: currentCategory === category.key
                    ? 'linear-gradient(135deg, #baf4ff 0%, #87d3ff 50%, #5bb8ff 100%)'
                    : 'linear-gradient(135deg, #e6f9ff 0%, #baf4ff 50%, #87d3ff 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box'
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: currentCategory === category.key
                      ? 'linear-gradient(135deg, #baf4ff 0%, #87d3ff 50%, #5bb8ff 100%)'
                      : 'linear-gradient(135deg, #e6f9ff 0%, #baf4ff 50%, #87d3ff 100%)',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor'
                  }}
                />
                <Image
                  src={category.icon}
                  alt={category.label}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-full"
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-category.png';
                  }}
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