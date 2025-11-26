'use client'

import { useCategoriesQuery } from '@/redux/api/categoriesApi';
import Image from 'next/image';
import { useCallback } from 'react';

interface CategoryNavigationProps {
  totalProducts: number;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CategoryNavigation = ({ selectedCategories, onCategoryChange }: CategoryNavigationProps) => {
  const { data } = useCategoriesQuery({});
  const rawCategories = data?.data || [];

  // Filter and map API data to component format
  const categoryData = rawCategories
    .filter((cat: any) => cat.isActive)
    .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    .map((cat: any) => ({
      key: cat.slug,
      label: cat.name,
      icon: cat.imageUrl || '/placeholder-category.png',
      id: cat.id
    }));

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      // Remove category if already selected
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      // Add category to selection
      onCategoryChange([...selectedCategories, categoryId]);
    }
  }, [selectedCategories, onCategoryChange]);

  return (
    <div className="flex flex-col items-center gap-4 mb-6 w-full max-w-full">
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

          {categoryData.map((category: any) => {
            const isSelected = selectedCategories.includes(category.id);

            return (
              <button
                key={category.key}
                onClick={() => handleCategoryClick(category.id)}
                className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0 p-1 transition-all duration-200 active:scale-95"
              >
                <div
                  className={`
                    rounded-full flex items-center justify-center border-3 transition-all duration-200
                    w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 relative overflow-hidden
                    ${isSelected
                      ? 'shadow-lg scale-105'
                      : 'hover:scale-105'
                    }
                    shadow-sm hover:shadow-md
                  `}
                  style={{
                    border: '3px solid transparent',
                    backgroundImage: isSelected
                      ? 'linear-gradient(135deg, #baf4ff 0%, #87d3ff 50%, #5bb8ff 100%)'
                      : 'linear-gradient(135deg, #e6f9ff 0%, #baf4ff 50%, #87d3ff 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box'
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: isSelected
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
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-category.png';
                    }}
                  />
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <span className={`
                  text-xs sm:text-sm font-medium transition-colors text-center whitespace-nowrap
                  ${isSelected
                    ? 'text-orange-600 font-semibold'
                    : 'text-gray-700 hover:text-orange-600'
                  }
                `}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;