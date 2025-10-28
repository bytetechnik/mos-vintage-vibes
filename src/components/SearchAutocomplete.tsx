import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { Clock, Search, TrendingUp, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  onProductSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

const SearchAutocomplete = ({
  onSearch,
  onProductSelect,
  placeholder = "Search for products, brands, categories...",
  className = ""
}: SearchAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Nike', 'Adidas', 'Supreme', 'Vintage', 'Streetwear', 'Hoodies', 'Jeans'
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch search suggestions
  const { data: searchResults, isLoading } = useProducts({
    search: query,
    per_page: 5
  });

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((search: string) => {
    const trimmed = search.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter(s => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
    setSelectedIndex(-1);
  }, []);

  // Handle search submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      onSearch(query.trim());
      setIsOpen(false);
    }
  }, [query, onSearch, saveRecentSearch]);

  // Handle product selection
  const handleProductSelect = useCallback((product: Product) => {
    onProductSelect(product);
    setIsOpen(false);
    setQuery('');
  }, [onProductSelect]);

  // Handle recent search selection
  const handleRecentSearchSelect = useCallback((search: string) => {
    setQuery(search);
    saveRecentSearch(search);
    onSearch(search);
    setIsOpen(false);
  }, [onSearch, saveRecentSearch]);

  // Handle trending search selection
  const handleTrendingSearchSelect = useCallback((search: string) => {
    setQuery(search);
    onSearch(search);
    setIsOpen(false);
  }, [onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    const suggestions = [
      ...(searchResults?.data || []),
      ...recentSearches,
      ...trendingSearches
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selected = suggestions[selectedIndex];
          if (typeof selected === 'string') {
            handleRecentSearchSelect(selected);
          } else {
            handleProductSelect(selected as Product);
          }
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, searchResults, recentSearches, trendingSearches, selectedIndex, query, handleSubmit, handleProductSelect, handleRecentSearchSelect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                setSelectedIndex(-1);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-[60vh] sm:max-h-96 overflow-y-auto"
        >
          {/* Search Results */}
          {query && (
            <div className="p-2">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Search Results
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-accent">
                      <div className="w-12 h-12 bg-muted rounded animate-pulse" />
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults?.data && searchResults.data.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.data.map((product, index) => (
                    <div
                      key={product.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${selectedIndex === index ? 'bg-accent' : 'hover:bg-accent'
                        }`}
                      onClick={() => handleProductSelect(product)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}   // w-12 → 12 * 4 = 48px
                        height={48}  // h-12 → 12 * 4 = 48px
                        className="object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {/* {product.brand} • €{product.price.toFixed(2)} */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground p-2">
                  No products found for &quote;{query}&quot;
                </div>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-border">
              <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={search}
                    className={`p-2 rounded cursor-pointer transition-colors ${selectedIndex === (searchResults?.data?.length || 0) + index
                      ? 'bg-accent'
                      : 'hover:bg-accent'
                      }`}
                    onClick={() => handleRecentSearchSelect(search)}
                  >
                    <span className="text-sm">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-2 border-t border-border">
            <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </div>
            <div className="flex flex-wrap gap-2">
              {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
              {trendingSearches.map((search, index) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleTrendingSearchSelect(search)}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete; 