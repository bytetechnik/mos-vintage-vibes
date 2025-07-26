import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProductCategory } from '@/types/product';

interface FilterSidebarProps {
  selectedSizes: string[];
  onSizeChange: (size: string, checked: boolean) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  outOfStock: boolean;
  onOutOfStockChange: (checked: boolean) => void;
  selectedCategories: ProductCategory[];
  onCategoryChange: (category: ProductCategory, checked: boolean) => void;
  selectedBrands: string[];
  onBrandChange: (brand: string, checked: boolean) => void;
  selectedConditions: number[];
  onConditionChange: (condition: number, checked: boolean) => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  categoryNames: Record<string, string>;
  brands: string[];
  conditions: number[];
  activeFiltersCount: number;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  selectedSizes,
  onSizeChange,
  inStockOnly,
  onInStockChange,
  outOfStock,
  onOutOfStockChange,
  selectedCategories,
  onCategoryChange,
  selectedBrands,
  onBrandChange,
  selectedConditions,
  onConditionChange,
  priceRange,
  onPriceRangeChange,
  categoryNames,
  brands,
  conditions,
  activeFiltersCount,
  onClearFilters
}: FilterSidebarProps) => {
  const [showMoreSizes, setShowMoreSizes] = useState(false);

  const sizes = [
    'XS', 'xS', 'S', 'M', 'L', 'XL', 'XXL',
    'Damen', 'Damen L', 'Damen M'
  ];

  const displayedSizes = showMoreSizes ? sizes : sizes.slice(0, 7);

  return (
    <div className="w-full lg:w-64 shrink-0 bg-white p-4 rounded-lg shadow-sm border">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {Object.entries(categoryNames).map(([key, name]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={selectedCategories.includes(key as ProductCategory)}
                onCheckedChange={(checked) => 
                  onCategoryChange(key as ProductCategory, checked as boolean)
                }
              />
              <label htmlFor={key} className="text-sm text-gray-700 cursor-pointer">
                {name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => 
                  onBrandChange(brand, checked as boolean)
                }
              />
              <label htmlFor={`brand-${brand}`} className="text-sm text-gray-700 cursor-pointer">
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">VERFÜGBARKEIT</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={onInStockChange}
            />
            <label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer">
              Auf Lager
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="out-of-stock"
              checked={outOfStock}
              onCheckedChange={onOutOfStockChange}
            />
            <label htmlFor="out-of-stock" className="text-sm text-gray-700 cursor-pointer">
              Nicht vorrätig
            </label>
          </div>
        </div>
      </div>

      {/* Size Section */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">GRÖSSE</h3>
        <div className="space-y-2">
          {displayedSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => onSizeChange(size, checked as boolean)}
              />
              <label htmlFor={`size-${size}`} className="text-sm text-gray-700 cursor-pointer">
                {size}
              </label>
            </div>
          ))}
        </div>
        
        {sizes.length > 7 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreSizes(!showMoreSizes)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
          >
            {showMoreSizes ? (
              <>
                WENIGER ANZEIGEN
                <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                MEHR ANZEIGEN
                <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Condition Section */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Condition</h4>
        <div className="space-y-2">
          {conditions.map(condition => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={selectedConditions.includes(condition)}
                onCheckedChange={(checked) => 
                  onConditionChange(condition, checked as boolean)
                }
              />
              <label htmlFor={`condition-${condition}`} className="text-sm text-gray-700 cursor-pointer">
                {condition}/10 {condition === 10 ? '(New)' : condition >= 9 ? '(Like New)' : condition >= 8 ? '(Excellent)' : '(Good)'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 