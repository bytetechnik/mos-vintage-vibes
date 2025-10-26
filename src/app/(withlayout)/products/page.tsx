'use client'

import { Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

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

  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialSize = searchParams.get('size');
  const initialSort = searchParams.get('sort') || 'newest';

  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditionRating, setSelectedConditionRating] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialSize ? [initialSize] : []
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);

  const queryParams = useMemo(() => {
    const params: any = {};
    if (initialCategory) params.category = initialCategory;
    if (initialSize) params.size = initialSize;
    if (initialSearch) params.search = initialSearch;
    return params;
  }, [initialCategory, initialSize, initialSearch]);

  const { data, isLoading, error } = useProductsQuery(queryParams);

  const productsData = useMemo(() => {
    return data?.data?.data || [];
  }, [data?.data?.data]);

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

  const filteredProducts = useMemo(() => {
    const filtered = productsData.filter((p: any) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.categoryName);
      const matchesSize = selectedSizes.length === 0 || p.variants.some((v: any) => selectedSizes.includes(v.size));
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brandName);
      const matchesCondition = selectedConditionRating === null || p.conditionRating === selectedConditionRating;
      const matchesSearch = searchQuery === '' ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStock = !inStockOnly && !outOfStock ? true :
        (inStockOnly && p.inStock) || (outOfStock && !p.inStock);

      const matchesPrice =
        (!priceRange.min || p.sellingPrice >= parseFloat(priceRange.min)) &&
        (!priceRange.max || p.sellingPrice <= parseFloat(priceRange.max));

      return matchesCategory && matchesSize && matchesBrand && matchesCondition &&
        matchesSearch && matchesStock && matchesPrice;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'condition':
        sorted.sort((a, b) => b.conditionRating - a.conditionRating);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return sorted;
  }, [productsData, selectedCategories, selectedSizes, selectedBrands, selectedConditionRating,
    searchQuery, inStockOnly, outOfStock, priceRange, sortBy]);

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

  const handleConditionRatingChange = (rating: number | null) => {
    setSelectedConditionRating(rating);
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...selectedSizes, size]
      : selectedSizes.filter(s => s !== size);

    setSelectedSizes(newSizes);
    updateSearchParams({ size: newSizes.length > 0 ? newSizes.join(',') : null });
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    updateSearchParams({ sort: value });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateSearchParams({ search: query || null });
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

      <CategoryNavigation totalProducts={filteredProducts.length} />

      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
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
        />
      )}
    </div>
  );
};

export default Products;