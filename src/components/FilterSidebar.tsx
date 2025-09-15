import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

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
        className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Filter Overlay */}
      <div className={`fixed inset-0 z-50 bg-white transition-transform duration-300 w-full max-w-full ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <Button variant="ghost" size="icon" onClick={onClose} className="p-0">
            <X className="w-5 h-5" />
          </Button>
          <h3 className="font-bold text-lg ml-4">filter</h3>
        </div>

        {/* Content */}
        <div className="p-4 space-y-8 overflow-y-auto h-full w-full max-w-full">

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

          {/* Condition Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-bold text-black text-sm uppercase">condition</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
              <div className="w-1 h-1 bg-gray-400 ml-2"></div>
            </div>
            <div className="space-y-3">
              {conditions.map(condition => (
                <div key={condition} className="flex items-center space-x-3">
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={(checked) =>
                      onConditionChange(condition, checked as boolean)
                    }
                    className="border-gray-300"
                  />
                  <Label htmlFor={`condition-${condition}`} className="text-sm text-black cursor-pointer">
                    {condition}/10 {condition === 10 ? '(New)' : condition >= 9 ? '(Like New)' : condition >= 8 ? '(Excellent)' : '(Good)'}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <h4 className="font-bold text-black text-sm uppercase">price range</h4>
              <div className="flex-1 border-t border-gray-200 ml-4"></div>
              <div className="w-1 h-1 bg-gray-400 ml-2"></div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
                  className="w-full"
                />
              </div>
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