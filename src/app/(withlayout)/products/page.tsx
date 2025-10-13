'use client'

import CategoryNavigation from '@/components/CategoryNavigation';
import FilterSidebar from '@/components/FilterSidebar';

import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { ProductCategory } from '@/types/product';
import { Filter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// ✅ Import mock data instead of hooks
import { categoryNames } from '@/data/products';
import { useProductsMutation } from '@/redux/api/product/productApi';

const Products = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useIsMobile();

  // Get initial values from URL params
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSearch = searchParams.get('search') || '';
  // const initialFeatured = searchParams.get('featured') === 'true';
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
  const [products] = useProductsMutation();
  const [productsData, setProductsData] = useState<any[]>([]);

  // Fetch products on mount or when filters change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    products({
      category: initialCategory || undefined,
      size: initialSize || undefined,
      search: initialSearch || undefined,
      // featured: initialFeatured || undefined,
    })
      .unwrap()
      .then((data: any) => {
        console.log();
        if (isMounted) setProductsData(data.data || []);
      })
      .catch(() => {
        if (isMounted) setProductsData([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [products, initialCategory, initialSize, initialSearch]);

  // ✅ Use mock products directly
  // let filteredProducts = productsData.filter((p) => {
  //   const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
  //   const matchesSize = selectedSizes.length === 0 || selectedSizes.includes(p.size);
  //   const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(p.condition.rating);
  //   const matchesSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesStock =
  //     (inStockOnly && p.inStock) ||
  //     (outOfStock && !p.inStock) ||
  //     (!inStockOnly && !outOfStock);

  //   return matchesCategory && matchesSize && matchesCondition && matchesSearch && matchesStock;
  // });

  const filteredProducts = productsData


  // // ✅ Sorting
  // if (sortBy === 'price-low') {
  //   filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  // } else if (sortBy === 'price-high') {
  //   filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  // } else if (sortBy === 'name') {
  //   filteredProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  // } else if (sortBy === 'condition') {
  //   filteredProducts = filteredProducts.sort((a, b) => b.condition.rating - a.condition.rating);
  // } else {
  //   filteredProducts = filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // }

  // Get unique conditions from products
  // const conditions = [...new Set(mockProducts.map(p => p.condition.rating))].sort((a, b) => b - a);

  const handleConditionChange = (condition: number, checked: boolean) => {
    // if (checked) {
    //   setSelectedConditions([...selectedConditions, condition]);
    // } else {
    //   setSelectedConditions(selectedConditions.filter(c => c !== condition));
    // }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      const newSizes = [...selectedSizes, size];
      setSelectedSizes(newSizes);
      updateSearchParams({ size });
    } else {
      const newSizes = selectedSizes.filter(s => s !== size);
      setSelectedSizes(newSizes);
      updateSearchParams({ size: newSizes.length > 0 ? newSizes[0] : null });
    }
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
    setSelectedConditions([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setOutOfStock(false);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setSortBy('newest');

    // Clear all URL params
    router.push(pathname, { scroll: false });
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + selectedConditions.length +
    selectedSizes.length + (inStockOnly ? 1 : 0) + (outOfStock ? 1 : 0) +
    (priceRange.min ? 1 : 0) + (priceRange.max ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 mt-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
          {initialCategory ? categoryNames[initialCategory] || 'All Products' : 'All Products'}
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
        {/* Left Sidebar Filters */}
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
            // conditions={conditions}
            conditions={[]}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={clearFilters}
            isMobile={false}
          />
        )}

        {/* Products Grid */}
        <div className="flex-1 w-full min-w-0">
          {!isLoading && filteredProducts.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <Filter className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} imageIndex={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
