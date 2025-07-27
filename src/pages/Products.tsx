import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import CategoryNavigation from '@/components/CategoryNavigation';
import FilterSidebar from '@/components/FilterSidebar';
import { products, categoryNames } from '@/data/products';
import { ProductCategory } from '@/types/product';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get initial values from URL params
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialFeatured = searchParams.get('featured') === 'true';
  const initialSize = searchParams.get('size');

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialSize ? [initialSize] : []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Sync URL params with state
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    const categoryParam = searchParams.get('category') as ProductCategory | null;
    const sizeParam = searchParams.get('size');
    const genderParam = searchParams.get('gender');
    
    if (sortParam) {
      setSortBy(sortParam);
    }
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    
    if (sizeParam) {
      setSelectedSizes([sizeParam]);
    }
    
    // Handle gender parameter (map to appropriate filter)
    if (genderParam) {
      // You might want to add gender filtering logic here
      // For now, we'll just store it in the URL
    }
  }, [searchParams]);

  // Get unique brands and conditions
  const brands = [...new Set(products.map(p => p.brand))];
  const conditions = [...new Set(products.map(p => p.condition.rating))].sort((a, b) => b - a);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Condition filter
      if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition.rating)) {
        return false;
      }

      // Size filter
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }

      // Stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (outOfStock && product.inStock) {
        return false;
      }

      // Price range filter
      if (priceRange.min && product.price < parseFloat(priceRange.min)) {
        return false;
      }
      if (priceRange.max && product.price > parseFloat(priceRange.max)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Featured filter
      if (initialFeatured) {
        return product.featured;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'condition':
        filtered.sort((a, b) => b.condition.rating - a.condition.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [selectedCategories, selectedBrands, selectedConditions, selectedSizes, inStockOnly, outOfStock, priceRange, searchQuery, sortBy, initialFeatured]);

  const handleCategoryChange = (category: ProductCategory, checked: boolean) => {
    if (checked) {
      const newCategories = [...selectedCategories, category];
      setSelectedCategories(newCategories);
      // Update URL params
      const params = new URLSearchParams(searchParams);
      params.set('category', category);
      setSearchParams(params);
    } else {
      const newCategories = selectedCategories.filter(c => c !== category);
      setSelectedCategories(newCategories);
      // Update URL params
      const params = new URLSearchParams(searchParams);
      if (newCategories.length === 0) {
        params.delete('category');
      } else {
        params.set('category', newCategories[0]);
      }
      setSearchParams(params);
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleConditionChange = (condition: number, checked: boolean) => {
    if (checked) {
      setSelectedConditions([...selectedConditions, condition]);
    } else {
      setSelectedConditions(selectedConditions.filter(c => c !== condition));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      const newSizes = [...selectedSizes, size];
      setSelectedSizes(newSizes);
      // Update URL params
      const params = new URLSearchParams(searchParams);
      params.set('size', size);
      setSearchParams(params);
    } else {
      const newSizes = selectedSizes.filter(s => s !== size);
      setSelectedSizes(newSizes);
      // Update URL params
      const params = new URLSearchParams(searchParams);
      if (newSizes.length === 0) {
        params.delete('size');
      } else {
        params.set('size', newSizes[0]);
      }
      setSearchParams(params);
    }
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    // Update URL params
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setOutOfStock(false);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + selectedConditions.length + 
    selectedSizes.length + (inStockOnly ? 1 : 0) + (outOfStock ? 1 : 0) +
    (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 mt-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          {initialCategory ? categoryNames[initialCategory] : 'All Products'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover our curated collection of vintage and contemporary streetwear
        </p>
      </div>

      {/* Category Navigation */}
      <CategoryNavigation totalProducts={filteredProducts.length} />

      {/* Search and Additional Controls */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              const query = e.target.value;
              setSearchQuery(query);
              // Update URL params
              const params = new URLSearchParams(searchParams);
              if (query) {
                params.set('search', query);
              } else {
                params.delete('search');
              }
              setSearchParams(params);
            }}
            className="w-full"
          />
        </div>
      </div>

             {/* Sort Dropdown (Desktop Only) */}
       <div className="hidden sm:flex justify-end mb-4">
         <div className="flex items-center gap-2">
           <span className="text-sm font-medium text-gray-700">Sortieren nach</span>
           <Select value={sortBy} onValueChange={handleSortByChange}>
             <SelectTrigger className="w-32 border-0 bg-transparent p-0 h-auto">
               <SelectValue />
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
       </div>

      <div className="flex flex-col xl:flex-row gap-3 md:gap-6">
        {/* Left Sidebar Filters - Only show on desktop (xl and above) */}
        {!isMobile && (
          <FilterSidebar
            selectedSizes={selectedSizes}
            onSizeChange={handleSizeChange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            outOfStock={outOfStock}
            onOutOfStockChange={setOutOfStock}
            selectedConditions={selectedConditions}
            onConditionChange={handleConditionChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            conditions={conditions}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
            isMobile={false}
          />
        )}

        {/* Products Grid */}
        <div className="flex-1 w-full min-w-0">
          {/* Mobile/Tablet Filter and Sort Controls - Top of products section */}
          {isMobile && (
            <div className="flex justify-between items-center mb-4">
              {/* Mobile Sort Dropdown */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={handleSortByChange}>
                  <SelectTrigger className="w-32 border-0 bg-transparent p-0 h-auto">
                    <SelectValue />
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
              
              {/* Filter Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileFilterOpen(true)}
                className="p-2"
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className={`grid gap-3 sm:gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} imageIndex={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Filter Overlay */}
      {isMobile && (
        <FilterSidebar
          selectedSizes={selectedSizes}
          onSizeChange={handleSizeChange}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          outOfStock={outOfStock}
          onOutOfStockChange={setOutOfStock}
          selectedConditions={selectedConditions}
          onConditionChange={handleConditionChange}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          conditions={conditions}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
          isMobile={true}
          isMobileOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
        />
      )}
    </div>
  );
};

export default Products;