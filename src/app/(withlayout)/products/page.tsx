'use client'

import { Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import CategoryNavigation from '@/components/CategoryNavigation';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryNames } from '@/data/products';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProductsQuery } from '@/redux/api/product/productApi';
import { ProductCategory } from '@/types/product';

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get all parameters from URL
  const page = parseInt(searchParams.get('page') || '0');
  const perPage = parseInt(searchParams.get('perPage') || '20');
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialSize = searchParams.get('size');
  const initialBrand = searchParams.get('brand') || '';
  const initialFeatured = searchParams.get('featured') === 'true';
  const initialInStock = searchParams.get('in_stock') === 'true';
  const initialPriceMin = searchParams.get('priceMin') || '';
  const initialPriceMax = searchParams.get('priceMax') || '';
  const initialSort = searchParams.get('sort') || 'newest';

  // Parse condition array from URL
  const conditionParam = searchParams.get('condition');
  const initialConditions = conditionParam ? conditionParam.split(',').map(Number) : [];

  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand ? [initialBrand] : []
  );
  const [selectedConditionRating, setSelectedConditionRating] = useState<number | null>(
    initialConditions.length > 0 ? initialConditions[0] : null
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialSize ? initialSize.split(',') : []
  );
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: initialPriceMin,
    max: initialPriceMax
  });
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);

  // Build API query parameters
  const apiParams = useMemo(() => {
    const params: any = {
      page,
      perPage,
    };

    if (searchQuery) params.search = searchQuery;
    if (selectedCategories.length > 0) params.category = selectedCategories[0];
    if (selectedBrands.length > 0) params.brand = selectedBrands[0];
    if (selectedConditionRating !== null) params.condition = [selectedConditionRating];
    if (priceRange.min) params.priceMin = parseFloat(priceRange.min);
    if (priceRange.max) params.priceMax = parseFloat(priceRange.max);
    if (initialFeatured) params.featured = true;
    if (inStockOnly) params.in_stock = true;
    if (sortBy) params.sort = sortBy;

    return params;
  }, [page, perPage, searchQuery, selectedCategories, selectedBrands, selectedConditionRating, priceRange, initialFeatured, inStockOnly, sortBy]);

  // Fetch data with dynamic parameters
  const { data, isLoading, error } = useProductsQuery(apiParams);

  const productsData = useMemo(() => {
    return data?.data?.data || [];
  }, [data?.data?.data]);

  // Client-side filtering for additional filters not supported by API
  const filteredProducts = useMemo(() => {
    let filtered = [...productsData];

    // Additional client-side filters
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product: any) => {
        const productSizes = product.variants.map((v: any) => v.size).filter(Boolean);
        return productSizes.some((size: string) => selectedSizes.includes(size));
      });
    }

    if (outOfStock) {
      filtered = filtered.filter((product: any) => !product.inStock);
    }

    return filtered;
  }, [productsData, selectedSizes, outOfStock]);

  const availableConditionRatings = useMemo(() => {
    const uniqueRatings = Array.from(
      new Set<number>(
        productsData
          .map((p: any) => p.conditionRating)
          .filter((v: number | undefined): v is number => typeof v === 'number')
      )
    );
    return uniqueRatings.sort((a, b) => b - a) as number[];
  }, [productsData]);

  // Update URL when filters change
  const updateURLParams = () => {
    const params = new URLSearchParams();

    if (page > 0) params.set('page', page.toString());
    if (perPage !== 20) params.set('perPage', perPage.toString());
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategories.length > 0) params.set('category', selectedCategories[0]);
    if (selectedBrands.length > 0) params.set('brand', selectedBrands[0]);
    if (selectedConditionRating !== null) params.set('condition', selectedConditionRating.toString());
    if (selectedSizes.length > 0) params.set('size', selectedSizes.join(','));
    if (priceRange.min) params.set('priceMin', priceRange.min);
    if (priceRange.max) params.set('priceMax', priceRange.max);
    if (initialFeatured) params.set('featured', 'true');
    if (inStockOnly) params.set('in_stock', 'true');
    if (sortBy !== 'newest') params.set('sort', sortBy);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Debounced URL update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURLParams();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategories, selectedBrands, selectedConditionRating, selectedSizes, priceRange, inStockOnly, sortBy]);

  const handleConditionRatingChange = (rating: number | null) => {
    setSelectedConditionRating(rating);
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
  };

  const handleCategoryChange = (category: ProductCategory | null) => {
    if (category) {
      setSelectedCategories([category]);
    } else {
      setSelectedCategories([]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedConditionRating(null);
    setSelectedSizes([]);
    setInStockOnly(false);
    setOutOfStock(false);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setSortBy('newest');
    router.push(pathname, { scroll: false });
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedConditionRating !== null ? 1 : 0) +
    selectedSizes.length +
    (inStockOnly ? 1 : 0) +
    (outOfStock ? 1 : 0) +
    (priceRange.min ? 1 : 0) +
    (priceRange.max ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 mt-12">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          {initialCategory ? categoryNames[initialCategory] || 'All Products' : 'All Products'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover our curated collection of vintage and contemporary streetwear
        </p>
      </div>

      <CategoryNavigation
        totalProducts={filteredProducts.length}
        selectedCategory={selectedCategories[0] || null}
        onCategoryChange={handleCategoryChange}
      />

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

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
        {!isMobile && (
          <FilterSidebar
            selectedSizes={selectedSizes}
            onSizeChange={handleSizeChange}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
            outOfStock={outOfStock}
            onOutOfStockChange={setOutOfStock}
            selectedConditionRating={selectedConditionRating}
            onConditionRatingChange={handleConditionRatingChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            availableConditionRatings={availableConditionRatings}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
            isMobile={false}
            selectedBrands={selectedBrands}
            onBrandChange={setSelectedBrands}
          />
        )}

        <div className="flex-1 w-full min-w-0">
          {isMobile && (
            <div className="flex justify-between items-center mb-4">
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

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500">Error loading products</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 p-8">
              {filteredProducts.map((product: any, idx: number) => (
                <ProductCard key={product.id} product={product} imageIndex={idx} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <FilterSidebar
          selectedSizes={selectedSizes}
          onSizeChange={handleSizeChange}
          inStockOnly={inStockOnly}
          onInStockChange={setInStockOnly}
          outOfStock={outOfStock}
          onOutOfStockChange={setOutOfStock}
          selectedConditionRating={selectedConditionRating}
          onConditionRatingChange={handleConditionRatingChange}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          availableConditionRatings={availableConditionRatings}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
          isMobile={true}
          isMobileOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          selectedBrands={selectedBrands}
          onBrandChange={setSelectedBrands}
        />
      )}
    </div>
  );
};

export default Products;