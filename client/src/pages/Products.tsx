import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import type { ProductWithCategory, Category } from '@shared/schema';
import {
  SmartSearchBar,
  SubtleMarketInsights,
  KeywordMonitor,
} from '@/components/SubtleAI';

export default function Products() {
  const params = useParams();
  const [location] = useLocation();
  const category = params.category;

  // Parse search query from URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedGemstones, setSelectedGemstones] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Build API URL based on filters
  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (searchQuery) params.append('search', searchQuery);
    return `/api/products?${params.toString()}`;
  };

  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<
    ProductWithCategory[]
  >({
    queryKey: [buildApiUrl()],
    enabled: true,
  });

  // Fetch categories for navigation
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Enhanced filtering and sorting with materials/gemstones
  const filteredAndSortedProducts = products
    ? [...products]
        .filter(product => {
          // Price range filter
          if (priceRange !== 'all') {
            const price = parseFloat(product.price);
            switch (priceRange) {
              case 'under-50':
                return price < 50;
              case '50-100':
                return price >= 50 && price < 100;
              case '100-200':
                return price >= 100 && price < 200;
              case 'over-200':
                return price >= 200;
              default:
                return true;
            }
          }

          // Materials filter
          if (selectedMaterials.length > 0 && product.materials) {
            const hasSelectedMaterial = selectedMaterials.some(material =>
              product.materials?.some(productMaterial =>
                productMaterial.toLowerCase().includes(material.toLowerCase())
              )
            );
            if (!hasSelectedMaterial) return false;
          }

          // Gemstones filter
          if (selectedGemstones.length > 0 && product.gemstones) {
            const hasSelectedGemstone = selectedGemstones.some(gemstone =>
              product.gemstones?.some(productGemstone =>
                productGemstone.toLowerCase().includes(gemstone.toLowerCase())
              )
            );
            if (!hasSelectedGemstone) return false;
          }

          return true;
        })
        .sort((a, b) => {
          switch (sortBy) {
            case 'featured':
              // Sort by stock quantity and price for featured items
              const aScore =
                (a.stockQuantity || 0) + (100 - parseFloat(a.price));
              const bScore =
                (b.stockQuantity || 0) + (100 - parseFloat(b.price));
              return bScore - aScore;
            case 'price-low':
              return parseFloat(a.price) - parseFloat(b.price);
            case 'price-high':
              return parseFloat(b.price) - parseFloat(a.price);
            case 'name':
              return a.name.localeCompare(b.name);
            case 'newest':
              return (
                new Date(b.createdAt || 0).getTime() -
                new Date(a.createdAt || 0).getTime()
              );
            case 'popular':
              return (b.stockQuantity || 0) - (a.stockQuantity || 0);
            default:
              return 0;
          }
        })
    : [];

  // Extract unique materials and gemstones for filter options
  const allMaterials = Array.from(
    new Set(products?.flatMap(p => p.materials || []) || [])
  );
  const allGemstones = Array.from(
    new Set(products?.flatMap(p => p.gemstones || []) || [])
  );

  // Get current category info
  const currentCategory = categories?.find(cat => cat.slug === category);

  // Update search when URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const searchFromUrl = urlParams.get('search') || '';
    setSearchQuery(searchFromUrl);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState(
        {},
        '',
        `/products?search=${encodeURIComponent(searchQuery.trim())}`
      );
    } else {
      window.history.pushState({}, '', '/products');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange('all');
    setSelectedMaterials([]);
    setSelectedGemstones([]);
    setShowFilters(false);
    window.history.pushState({}, '', '/products');
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials(prev =>
      prev.includes(material)
        ? prev.filter(m => m !== material)
        : [...prev, material]
    );
  };

  const toggleGemstone = (gemstone: string) => {
    setSelectedGemstones(prev =>
      prev.includes(gemstone)
        ? prev.filter(g => g !== gemstone)
        : [...prev, gemstone]
    );
  };

  const hasActiveFilters =
    priceRange !== 'all' ||
    selectedMaterials.length > 0 ||
    selectedGemstones.length > 0 ||
    searchQuery.trim() !== '';

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-warm via-pearl-cream to-moonstone">
      {/* Mystical Header Section with Skull Overlay */}
      <section className="relative bg-gradient-to-br from-pearl-cream via-crystal-accents to-pearl-cream text-navy overflow-hidden py-20">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'var(--skull-overlay)' }}
        />
        {/* Subtle turquoise accent borders */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skull-turquoise to-transparent" />

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            {/* Ornate Decorative Frame */}
            <div className="mb-6">
              <div className="inline-block px-6 py-2 border border-ornate-frame-gold/20 rounded-lg bg-ornate-frame-gold/5 backdrop-blur-sm">
                <span className="text-ornate-frame-gold/80 text-sm font-medium tracking-wider uppercase">
                  Crystal Collection
                </span>
              </div>
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: 'var(--brand-font-heading)' }}
            >
              <span className="text-navy">
                {currentCategory
                  ? currentCategory.name
                  : searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : 'Our Collections'}
              </span>
            </h1>

            <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-transparent via-troves-turquoise to-transparent rounded-full" />

            <p className="text-navy/80 text-xl max-w-3xl mx-auto leading-relaxed">
              {currentCategory
                ? currentCategory.description
                : 'Where authentic gemstone energies merge with artisan craftsmanship. Each piece channels crystal wisdom to amplify your inner light, promote healing, and bring beauty to your life.'}
            </p>

            {/* Mystical Underglow Effect */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-20 bg-skull-turquoise/30 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Subtle market insights */}
        <SubtleMarketInsights category={currentCategory?.name} />

        {/* Background keyword monitoring */}
        <KeywordMonitor />

        <div className="smart-flex">
          {/* Mystical Sidebar Filters */}
          <aside className="flex-shrink-0" style={{ flexBasis: '300px' }}>
            <Card className="sticky top-8 shadow-2xl border border-ornate-frame-gold/20 bg-gradient-to-br from-pearl-cream to-crystal-accents backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-troves-turquoise/10 to-skull-turquoise/10 border-b border-ornate-frame-gold/20">
                <CardTitle className="flex items-center space-x-3 text-troves-turquoise">
                  <SlidersHorizontal className="h-6 w-6 text-ornate-frame-gold" />
                  <span className="font-bold text-xl">Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-6">
                {/* Mystical Search */}
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-4 top-3 h-5 w-5 text-troves-turquoise" />
                    <Input
                      type="text"
                      placeholder="Search jewelry..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-crystal-accents/80 border-2 border-skull-turquoise/20 rounded-lg focus:border-ornate-frame-gold focus:ring-2 focus:ring-ornate-frame-gold/20 text-foreground placeholder-troves-turquoise/60"
                    />
                  </div>
                </form>

                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3 text-navy">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant={!category ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => (window.location.href = '/products')}
                    >
                      All Collections
                    </Button>
                    {categories?.map(cat => (
                      <Button
                        key={cat.id}
                        variant={category === cat.slug ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() =>
                          (window.location.href = `/products/${cat.slug}`)
                        }
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3 text-navy">Price Range</h3>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-1000">Under $1,000</SelectItem>
                      <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5000-10000">
                        $5,000 - $10,000
                      </SelectItem>
                      <SelectItem value="over-10000">Over $10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold mb-3 text-navy">Sort By</h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {(searchQuery ||
                  category ||
                  priceRange !== 'all' ||
                  sortBy !== 'name') && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-serif font-bold text-navy">
                  {filteredAndSortedProducts.length}{' '}
                  {filteredAndSortedProducts.length === 1
                    ? 'Product'
                    : 'Products'}
                </h2>
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="bg-elegant-gold text-navy"
                  >
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {category && (
                  <Badge variant="secondary" className="bg-navy text-white">
                    {currentCategory?.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoadingProducts ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-64 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              /* No Results */
              <Card className="text-center py-16">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {searchQuery
                        ? `No products match your search for "${searchQuery}"`
                        : 'No products match your current filters'}
                    </p>
                    <Button
                      onClick={clearFilters}
                      className="bg-elegant-gold hover:bg-yellow-400 text-navy"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Products Grid */
              <div className="adaptive-grid">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
