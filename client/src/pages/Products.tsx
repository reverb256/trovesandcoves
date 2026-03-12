import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import type { ProductWithCategory, Category } from '@shared/types';
import { Filter, Search, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import SEOHead from '@/components/SEOHead';
import SectionPill from '@/components/SectionPill';
import SectionDivider from '@/components/SectionDivider';

export default function Products() {
  const params = useParams();
  const [location] = useLocation();
  const category = (params as Record<string, string>).category;

  // Parse search query from URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Build API URL based on filters
  const buildApiUrl = () => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (searchQuery) params.append('search', searchQuery);
    return `/api/products?${params.toString()}`;
  };

  // Fetch products
  const { data: products, isLoading: isLoadingProducts } = useQuery<ProductWithCategory[]>({
    queryKey: [buildApiUrl()],
    enabled: true,
  });

  // Fetch categories for navigation
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Enhanced filtering and sorting
  const filteredAndSortedProducts = products
    ? [...products].sort((a, b) => {
        switch (sortBy) {
          case 'featured':
            const aScore = (a.stockQuantity || 0) + (100 - parseFloat(a.price));
            const bScore = (b.stockQuantity || 0) + (100 - parseFloat(b.price));
            return bScore - aScore;
          case 'price-low':
            return parseFloat(a.price) - parseFloat(b.price);
          case 'price-high':
            return parseFloat(b.price) - parseFloat(a.price);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'newest':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
          default:
            return 0;
        }
      })
    : [];

  // Get current category info
  const currentCategory = categories?.find((cat) => cat.slug === category);

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
    window.history.pushState({}, '', '/products');
  };

  const hasActiveFilters = searchQuery.trim() !== '' || category;

  return (
      <>
      <SEOHead
        title={currentCategory
          ? `${currentCategory.name} | Handcrafted Jewelry | Troves & Coves`
          : searchQuery
          ? `Search: "${searchQuery}" | Jewelry Collection | Troves & Coves`
          : `Shop Jewelry | Handcrafted Necklaces & Bracelets | Troves & Coves`
        }
        description={currentCategory
          ? `Browse our ${currentCategory.name} collection. ${currentCategory.description}`
          : searchQuery
          ? `Search results for "${searchQuery}" in our handcrafted jewelry collection.`
          : "Explore our curated selection of handcrafted jewelry. Each piece blends 14k gold-plated elegance with natural beauty—crafted with intention."
        }
        url={currentCategory
          ? `https://trovesandcoves.ca/products/${currentCategory.slug}`
          : searchQuery
          ? `https://trovesandcoves.ca/products?search=${encodeURIComponent(searchQuery)}`
          : 'https://trovesandcoves.ca/products'
        }
        type="website"
      />
      <div className="min-h-screen content-layer" style={{ backgroundColor: 'hsl(var(--bg-primary))' }}>
      {/* Header Section */}
      <section className="relative py-24 border-b border-turquoise-light">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(var(--accent-vibrant),0.05)] via-transparent to-transparent"></div>

        <div className="chamber-container relative">
          <div className="text-center">
            {/* Badge */}
            <SectionPill variant="turquoise" className="mb-6">
              The Collection
            </SectionPill>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 flex flex-col md:flex-row items-center justify-center gap-3">
              {currentCategory ? (
                <>
                  <span style={{ fontFamily: "\"Libre Baskerville\", serif", color: 'hsl(var(--accent-vibrant))' }}>{currentCategory.name}</span>
                  <span className="text-sm md:text-base font-normal" style={{ fontFamily: "\"Montserrat\", sans-serif", color: 'hsl(var(--text-secondary))' }}>
                    | Handcrafted Jewelry
                  </span>
                </>
              ) : searchQuery ? (
                <>
                  <span style={{ fontFamily: "\"Libre Baskerville\", serif", color: 'hsl(var(--accent-vibrant))' }}>Searching for</span>
                  <span style={{ fontFamily: "\"Alex Brush\", cursive", color: 'hsl(var(--gold-medium))' }}>"{searchQuery}"</span>
                </>
              ) : (
                <>
                  <span style={{ fontFamily: "\"Libre Baskerville\", serif", color: 'hsl(var(--accent-vibrant))', textTransform: 'uppercase' }}>
                    Shop Jewelry
                  </span>
                  <span style={{ fontFamily: "\"Alex Brush\", cursive", color: 'hsl(var(--gold-medium))' }}>
                    &amp; Collections
                  </span>
                </>
              )}
            </h1>

            <SectionDivider variant="gradient" className="mb-6" />

            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "\"Montserrat\", sans-serif", color: 'hsl(var(--text-secondary))' }}>
              {currentCategory
                ? currentCategory.description
                : 'Statement pieces crafted with intention to empower your confidence. Each piece blends 14k gold-plated elegance with natural crystal beauty.'}
            </p>
          </div>
        </div>
      </section>

      <div className="chamber-container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <Card className="rounded-lg shadow-sm p-6 lg:sticky lg:top-24">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}>
                <Filter className="w-5 h-5" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                <span style={{ color: 'hsl(var(--text-primary))' }}>Refine Your Search</span>
              </h3>

              {/* Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'hsl(var(--accent-vibrant))' }} />
                  <input
                    type="text"
                    placeholder="Search crystals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg text-primary focus:outline-none focus:ring-1 focus:ring-[hsla(var(--accent-vibrant),0.3)] transition-colors duration-300"
                    style={{
                      backgroundColor: 'hsl(var(--bg-card))',
                      borderColor: 'hsl(var(--border-medium))',
                      color: 'hsl(var(--text-primary))'
                    }}
                  />
                </div>
              </form>

              {/* Categories */}
              <div className="mb-6">
                <h4 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: 'hsl(var(--text-muted))',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem'
                }}>
                  Categories
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => (window.location.href = '/products')}
                    className="w-full text-left px-4 py-2 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: !category ? 'hsl(var(--accent-vibrant))' : 'transparent',
                      border: !category ? '1px solid hsl(var(--accent-vibrant))' : '1px solid hsl(var(--border-light))',
                      color: !category ? '#fff' : 'hsl(var(--text-primary))'
                    }}
                  >
                    All Collections
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => (window.location.href = `/products/${cat.slug}`)}
                      className="w-full text-left px-4 py-2 rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: category === cat.slug ? 'hsl(var(--accent-vibrant))' : 'transparent',
                        border: category === cat.slug ? '1px solid hsl(var(--accent-vibrant))' : '1px solid hsl(var(--border-light))',
                        color: category === cat.slug ? '#fff' : 'hsl(var(--text-primary))'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: 'hsl(var(--text-muted))',
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem'
                }}>
                  Sort By
                </h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-[hsla(var(--accent-vibrant),0.3)] transition-colors duration-300"
                  style={{
                    backgroundColor: 'hsl(var(--bg-card))',
                    borderColor: 'hsl(var(--border-medium))',
                    color: 'hsl(var(--text-primary))'
                  }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border rounded-lg hover:opacity-80 transition-colors duration-300"
                  style={{ border: '1px solid hsl(var(--gold-medium))', color: 'hsl(var(--gold-medium))' }}
                >
                  <X className="w-4 h-4" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold" style={{
                fontFamily: "\"Libre Baskerville\", serif",
                color: 'hsl(var(--accent-vibrant))'
              }}>
                {filteredAndSortedProducts.length}{' '}
                <span style={{ color: 'hsl(var(--text-primary))' }}>
                  {filteredAndSortedProducts.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </h2>
            </div>

            {/* Loading State */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-[hsl(var(--bg-card))/50] rounded-lg animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-turquoise-soft border-t-[hsla(var(--accent-vibrant),0.8)] rounded-full animate-spin"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              /* No Results */
              <div className="rounded-lg shadow-sm p-16 text-center" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
                <Filter className="w-16 h-16 mx-auto mb-6" style={{ color: 'hsl(var(--text-muted))', opacity: 0.3 }} />
                <h3 className="text-2xl font-semibold mb-4" style={{
                  fontFamily: "'Libre Baskerville', serif",
                  color: 'hsl(var(--accent-vibrant))'
                }}>
                  No products found
                </h3>
                <p className="mb-8" style={{
                  fontFamily: "'Montserrat', sans-serif",
                  color: 'hsl(var(--text-secondary))'
                }}>
                  {searchQuery
                    ? `No products match your search for "${searchQuery}"`
                    : 'No products match your current filters'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 rounded-lg border hover:opacity-80 transition-colors duration-300"
                  style={{
                    border: '2px solid hsl(var(--accent-vibrant))',
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--accent-vibrant))',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product, index) => (
                  <a
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="group block animate-reveal"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="rounded-lg shadow-sm hover:shadow-md transition-shadow h-full p-6" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
                      {/* Product Image */}
                      <div className="relative aspect-square mb-6 overflow-hidden bg-gradient-to-br from-[hsla(var(--bg-primary),0.3)] to-[hsla(var(--bg-secondary),0.5)]" style={{ border: '1px solid hsla(var(--border-light))' }}>
                        <img
                          src={product.imageUrl || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsla(var(--bg-overlay),0.8)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Category Badge */}
                        {product.category && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] tracking-wider uppercase rounded-full backdrop-blur-sm" style={{
                            backgroundColor: 'hsla(var(--accent-vibrant), 0.9)',
                            color: '#fff'
                          }}>
                            {product.category.name}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-turquoise-bright transition-colors duration-300" style={{
                          fontFamily: "'Libre Baskerville', serif",
                          color: 'hsl(var(--text-primary))'
                        }}>
                          {product.name}
                        </h3>

                        <p className="text-sm mb-4 line-clamp-2" style={{
                          fontFamily: "'Montserrat', sans-serif",
                          color: 'hsl(var(--text-muted))'
                        }}>
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between pt-4" style={{
                          borderTop: '1px solid hsla(var(--accent-vibrant),0.15)'
                        }}>
                          <span className="text-lg font-semibold" style={{
                            fontFamily: "\"Libre Baskerville\", serif",
                            color: 'hsl(var(--gold-medium))'
                          }}>
                            ${product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
      </>
  );
}
