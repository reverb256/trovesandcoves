import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { apiUtils } from '@/apiClient';
import { Collapsible, CollapsibleContent } from './ui/collapsible';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface SearchBarProps {
  onResultsChange?: (results: any[]) => void;
  onFiltersChange?: (filters: FilterState) => void;
  initialSearch?: string;
}

export interface FilterState {
  search: string;
  material: string;
  gemstone: string;
  minPrice: number;
  maxPrice: number;
}

export function SearchBar({ onResultsChange, onFiltersChange, initialSearch = '' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    material: '',
    gemstone: '',
    minPrice: 0,
    maxPrice: 10000,
  });

  // Fetch available materials and gemstones
  const { data: materials } = useQuery({
    queryKey: ['/api/materials'],
    queryFn: async () => {
      const response = await fetch(`${apiUtils.getApiUrl()}/api/materials`);
      return response.json();
    },
    staleTime: Infinity,
  });

  const { data: gemstones } = useQuery({
    queryKey: ['/api/gemstones'],
    queryFn: async () => {
      const response = await fetch(`${apiUtils.getApiUrl()}/api/gemstones`);
      return response.json();
    },
    staleTime: Infinity,
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Update filters
    const newFilters = { ...filters, search: query };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);

    // Trigger search with debounce
    if (query.length >= 2 || query.length === 0) {
      await performSearch(newFilters);
    }
  };

  const performSearch = async (currentFilters: FilterState) => {
    const params = new URLSearchParams();
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.material) params.append('material', currentFilters.material);
    if (currentFilters.gemstone) params.append('gemstone', currentFilters.gemstone);
    if (currentFilters.minPrice > 0) params.append('minPrice', currentFilters.minPrice.toString());
    if (currentFilters.maxPrice < 10000) params.append('maxPrice', currentFilters.maxPrice.toString());

    const response = await fetch(`${apiUtils.getApiUrl()}/api/products?${params.toString()}`);
    const results = await response.json();
    onResultsChange?.(results);
  };

  const handleFilterChange = async (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
    await performSearch(newFilters);
  };

  const clearFilters = async () => {
    const clearedFilters: FilterState = {
      search: '',
      material: '',
      gemstone: '',
      minPrice: 0,
      maxPrice: 10000,
    };
    setFilters(clearedFilters);
    setSearchQuery('');
    onFiltersChange?.(clearedFilters);
    await performSearch(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.material || filters.gemstone ||
    filters.minPrice > 0 || filters.maxPrice < 10000;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search crystals, jewelry, gemstones..."
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => handleSearch('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={isExpanded ? 'bg-secondary' : ''}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('search', '')} />
            </Badge>
          )}
          {filters.material && (
            <Badge variant="secondary" className="gap-1">
              Material: {filters.material}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('material', '')} />
            </Badge>
          )}
          {filters.gemstone && (
            <Badge variant="secondary" className="gap-1">
              Gemstone: {filters.gemstone}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('gemstone', '')} />
            </Badge>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
            <Badge variant="secondary" className="gap-1">
              ${filters.minPrice} - ${filters.maxPrice}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={clearFilters}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-4 p-4 border rounded-lg bg-surface-50">
          {/* Material Filter */}
          <div className="space-y-2">
            <Label>Material</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!filters.material ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('material', '')}
              >
                All
              </Button>
              {materials?.slice(0, 10).map((material: string) => (
                <Button
                  key={material}
                  variant={filters.material === material ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('material', material)}
                >
                  {material}
                </Button>
              ))}
            </div>
          </div>

          {/* Gemstone Filter */}
          <div className="space-y-2">
            <Label>Gemstone</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={!filters.gemstone ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('gemstone', '')}
              >
                All
              </Button>
              {gemstones?.slice(0, 10).map((gemstone: string) => (
                <Button
                  key={gemstone}
                  variant={filters.gemstone === gemstone ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFilterChange('gemstone', gemstone)}
                >
                  {gemstone}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range: ${filters.minPrice} - ${filters.maxPrice}</Label>
            <div className="space-y-4">
              <div className="px-2">
                <Slider
                  value={[filters.minPrice]}
                  max={10000}
                  step={100}
                  onValueChange={([value]) => handleFilterChange('minPrice', value)}
                  className="w-full"
                />
              </div>
              <div className="px-2">
                <Slider
                  value={[filters.maxPrice]}
                  max={10000}
                  step={100}
                  onValueChange={([value]) => handleFilterChange('maxPrice', value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
