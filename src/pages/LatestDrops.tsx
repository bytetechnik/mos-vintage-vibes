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
import { categoryNames } from '@/data/products';
import { ProductCategory } from '@/types/product';

// Unique products for Latest Drops
const latestDropsProducts = [
  {
    id: 'ld1',
    name: 'Palace Skateboards Shell Jacket',
    brand: 'Palace',
    price: 210.00,
    originalPrice: 260.00,
    description: 'Limited edition Palace shell jacket, water-resistant and lightweight.',
    category: 'jackets' as ProductCategory,
    condition: { rating: 10, description: 'Completely new with tags' },
    size: 'M',
    color: 'Green',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=640&fit=crop',
      '/placeholder.svg',
    ],
    inStock: true,
    featured: true,
    tags: ['palace', 'skate', 'jacket'],
    createdAt: '2024-02-01',
  },
  {
    id: 'ld2',
    name: 'Bape Shark Hoodie',
    brand: 'Bape',
    price: 320.00,
    originalPrice: 400.00,
    description: 'Iconic Bape Shark hoodie, camo print, full zip.',
    category: 'sweaters-hoodies' as ProductCategory,
    condition: { rating: 9, description: 'Item is in perfect condition, no signs of wear, looks like new' },
    size: 'L',
    color: 'Camo',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=640&fit=crop',
      '/placeholder.svg',
    ],
    inStock: true,
    featured: true,
    tags: ['bape', 'shark', 'hoodie'],
    createdAt: '2024-02-02',
  },
  {
    id: 'ld3',
    name: 'Yeezy Boost 350 V2',
    brand: 'Adidas',
    price: 280.00,
    originalPrice: 350.00,
    description: 'Adidas Yeezy Boost 350 V2, "Zebra" colorway, deadstock.',
    category: 'accessories' as ProductCategory, // shoes is not a valid ProductCategory, using accessories as closest
    condition: { rating: 10, description: 'Completely new with tags' },
    size: '44',
    color: 'White/Black',
    images: [
      'https://images.unsplash.com/photo-1517260911205-8c6b8b6b7c5c?w=500&h=640&fit=crop',
      '/placeholder.svg',
    ],
    inStock: true,
    featured: false,
    tags: ['yeezy', 'adidas', 'shoes'],
    createdAt: '2024-02-03',
  },
  {
    id: 'ld4',
    name: 'Off-White Industrial Belt',
    brand: 'Off-White',
    price: 120.00,
    originalPrice: 180.00,
    description: 'Signature yellow Off-White industrial belt, new in packaging.',
    category: 'accessories' as ProductCategory,
    condition: { rating: 10, description: 'Completely new with tags' },
    size: 'One Size',
    color: 'Yellow',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=640&fit=crop',
      '/placeholder.svg',
    ],
    inStock: true,
    featured: false,
    tags: ['off-white', 'belt', 'accessory'],
    createdAt: '2024-02-04',
  },
  {
    id: 'ld5',
    name: 'Fear of God Essentials Sweatpants',
    brand: 'Fear of God',
    price: 140.00,
    originalPrice: 180.00,
    description: 'Essentials sweatpants by Fear of God, relaxed fit, sand color.',
    category: 'trackpants-joggers' as ProductCategory,
    condition: { rating: 9, description: 'Item is in perfect condition, no signs of wear, looks like new' },
    size: 'M',
    color: 'Sand',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&h=640&fit=crop',
      '/placeholder.svg',
    ],
    inStock: true,
    featured: true,
    tags: ['essentials', 'fear-of-god', 'sweatpants'],
    createdAt: '2024-02-05',
  },
];

const LatestDrops = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  // Get initial values from URL params
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialFeatured = searchParams.get('featured') === 'true';

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Get unique brands and conditions
  const brands = [...new Set(latestDropsProducts.map(p => p.brand))];
  const conditions = [...new Set(latestDropsProducts.map(p => p.condition.rating))].sort((a, b) => b - a);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = latestDropsProducts.filter(product => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }
      if (selectedConditions.length > 0 && !selectedConditions.includes(product.condition.rating)) {
        return false;
      }
      if (selectedSizes.length > 0 && !selectedSizes.includes(product.size)) {
        return false;
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (outOfStock && product.inStock) {
        return false;
      }
      if (priceRange.min && product.price < parseFloat(priceRange.min)) {
        return false;
      }
      if (priceRange.max && product.price > parseFloat(priceRange.max)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      if (initialFeatured) {
        return product.featured;
      }
      return true;
    });
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
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
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
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
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
          {initialCategory ? categoryNames[initialCategory] : 'Latest Drops'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Check out the freshest arrivals and exclusive drops!
        </p>
      </div>

      {/* Category Navigation */}
      <CategoryNavigation totalProducts={filteredProducts.length} />

      {/* Search and Additional Controls */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search latest drops..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="flex flex-col lg:flex-row gap-3 md:gap-6">
        {/* Left Sidebar Filters - Only show on desktop */}
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
          {/* Mobile Filter and Sort Controls - Top of products section */}
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

          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No drops found</h3>
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

      {/* Mobile Filter Overlay */}
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

export default LatestDrops; 