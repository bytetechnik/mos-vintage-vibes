'use client';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import CategoryNavigation from '@/components/CategoryNavigation';
import FilterSidebar from '@/components/FilterSidebar';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryNames } from '@/data/products';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLatestProductsQuery } from '@/redux/api/product/productApi';
import { Product, ProductCategory } from '@/types/product';

export default function LatestDropsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const isMobile = useIsMobile();

  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialFeatured = searchParams.get('featured') === 'true';

  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditionRating, setSelectedConditionRating] = useState<number | null>(null);
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

  const { data: latestProductsData } = useLatestProductsQuery({});
  const latestDropsProducts = useMemo(() => latestProductsData?.data || [], [latestProductsData]);

  const availableConditionRatings = Array.from(new Set(latestDropsProducts.map((p: any) => p.conditionRating)))
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => b - a);

  const filteredProducts = useMemo(() => {
    const filtered = latestDropsProducts.filter((product: Product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryName as ProductCategory)) {
        return false;
      }
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandName || '')) {
        return false;
      }
      if (selectedConditionRating !== null && product.conditionRating !== selectedConditionRating) {
        return false;
      }
      if (selectedSizes.length > 0) {
        const productSizes = product.variants.map(v => v.size).filter(Boolean);
        if (!productSizes.some(size => selectedSizes.includes(size!))) {
          return false;
        }
      }
      if (inStockOnly && !product.inStock) {
        return false;
      }
      if (outOfStock && product.inStock) {
        return false;
      }
      if (priceRange.min && product.sellingPrice < parseFloat(priceRange.min)) {
        return false;
      }
      if (priceRange.max && product.sellingPrice > parseFloat(priceRange.max)) {
        return false;
      }
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(query) ||
          (product.brandName && product.brandName.toLowerCase().includes(query)) ||
          product.description.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query)
        );
      }
      if (initialFeatured) {
        return product.featured;
      }
      return true;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: any, b: any) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => b.sellingPrice - a.sellingPrice);
        break;
      case 'name':
        filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
        break;
      case 'condition':
        filtered.sort((a: any, b: any) => b.conditionRating - a.conditionRating);
        break;
      case 'newest':
      default:
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return filtered;
  }, [latestDropsProducts, selectedCategories, selectedBrands, selectedConditionRating, selectedSizes, inStockOnly, outOfStock, priceRange, searchQuery, sortBy, initialFeatured]);

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
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    router.push(`/latest-drops?${params.toString()}`);
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
    router.push('/latest-drops');
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length +
    (selectedConditionRating !== null ? 1 : 0) + selectedSizes.length +
    (inStockOnly ? 1 : 0) + (outOfStock ? 1 : 0) +
    (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 mt-12">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          {initialCategory ? categoryNames[initialCategory] : 'Latest Drops'}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Check out the freshest arrivals and exclusive drops!
        </p>
      </div>

      <CategoryNavigation totalProducts={filteredProducts.length} />

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
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              {filteredProducts.map((product: Product, idx: number) => (
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
}