import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { ProductCategory } from '@/types/product';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FilterSidebarProps {
  selectedSizes: string[];
  onSizeChange: (size: string, checked: boolean) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  outOfStock: boolean;
  onOutOfStockChange: (checked: boolean) => void;
  selectedConditions: number[];
  onConditionChange: (condition: number, checked: boolean) => void;
  priceRange: { min: string; max: string };
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  conditions: number[];
  activeFiltersCount: number;
  onClearFilters: () => void;
  isMobile?: boolean;
  onClose?: () => void;
  isMobileOpen?: boolean;
  sortBy?: string;
  onSortByChange?: (value: string) => void;
}

const FilterSidebar = ({
  selectedSizes,
  onSizeChange,
  inStockOnly,
  onInStockChange,
  outOfStock,
  onOutOfStockChange,
  selectedConditions,
  onConditionChange,
  priceRange,
  onPriceRangeChange,
  conditions,
  activeFiltersCount,
  onClearFilters,
  isMobile = false,
  onClose,
  isMobileOpen = false,
  sortBy = 'newest',
  onSortByChange
}: FilterSidebarProps) => {
  const [showMoreSizes, setShowMoreSizes] = useState(false);

  const sizes = [
    'XS', 'xS', 'S', 'M', 'L', 'XL', 'XXL',
    'ladies', 'Women\'s L'
  ];

  const displayedSizes = showMoreSizes ? sizes : sizes.slice(0, 7);

  const mobileContent = (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
          isMobileOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none -z-10'
        }`}
        onClick={onClose}
      />
      
      {/* Filter Overlay */}
      <div className={`fixed top-0 right-0 h-full w-full bg-white transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0 z-50' : 'translate-x-full -z-10'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h3 className="font-bold text-lg">Filter</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>

          {/* Sort By Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-bold text-black text-sm uppercase">sort by</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
              <div className="w-1 h-1 bg-gray-400 ml-2"></div>
            </div>
            <RadioGroup value={sortBy} onValueChange={onSortByChange}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="newest" id="sort-newest" />
                  <Label htmlFor="sort-newest" className="text-sm text-black cursor-pointer">
                    Date, new to old
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="price-low" id="sort-price-low" />
                  <Label htmlFor="sort-price-low" className="text-sm text-black cursor-pointer">
                    Price, low to high
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="price-high" id="sort-price-high" />
                  <Label htmlFor="sort-price-high" className="text-sm text-black cursor-pointer">
                    Price, high to low
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="name" id="sort-name" />
                  <Label htmlFor="sort-name" className="text-sm text-black cursor-pointer">
                    Alphabetically, A-Z
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="condition" id="sort-condition" />
                  <Label htmlFor="sort-condition" className="text-sm text-black cursor-pointer">
                    Best quality
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Availability Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-bold text-black text-sm uppercase">availability</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
              <div className="w-1 h-1 bg-gray-400 ml-2"></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="in-stock"
                  checked={inStockOnly}
                  onCheckedChange={onInStockChange}
                  className="border-gray-300"
                />
                <Label htmlFor="in-stock" className="text-sm text-black cursor-pointer">
                  In stock
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="out-of-stock"
                  checked={outOfStock}
                  onCheckedChange={onOutOfStockChange}
                  className="border-gray-300"
                />
                <Label htmlFor="out-of-stock" className="text-sm text-black cursor-pointer">
                  Not in stock
                </Label>
              </div>
            </div>
          </div>

          {/* Size Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-bold text-black text-sm uppercase">size</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
              <div className="w-1 h-1 bg-gray-400 ml-2"></div>
            </div>
            <div className="space-y-3">
              {sizes.map((size) => (
                <div key={size} className="flex items-center space-x-3">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={(checked) => onSizeChange(size, checked as boolean)}
                    className="border-gray-300"
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm text-black cursor-pointer">
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const desktopContent = (
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
            <Label htmlFor="in-stock" className="text-sm text-gray-700 cursor-pointer">
              Auf Lager
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="out-of-stock"
              checked={outOfStock}
              onCheckedChange={onOutOfStockChange}
            />
            <Label htmlFor="out-of-stock" className="text-sm text-gray-700 cursor-pointer">
              Nicht vorrätig
            </Label>
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
              <Label htmlFor={`size-${size}`} className="text-sm text-gray-700 cursor-pointer">
                {size}
              </Label>
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
              <Label htmlFor={`condition-${condition}`} className="text-sm text-gray-700 cursor-pointer">
                {condition}/10 {condition === 10 ? '(New)' : condition >= 9 ? '(Like New)' : condition >= 8 ? '(Excellent)' : '(Good)'}
              </Label>
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

  // Only render mobile content if isMobile is true
  if (isMobile) {
    return mobileContent;
  }

  // Return desktop content for non-mobile
  return desktopContent;
};

export default FilterSidebar; 