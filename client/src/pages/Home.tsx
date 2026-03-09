import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import SEOHead from '@/components/SEOHead';
import Hero from '@/components/Hero';
import type { ProductWithCategory } from '@shared/types';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ['/api/products/featured'],
  });

  return (
    <>
      <SEOHead
        title="Troves & Coves - Handcrafted Crystal Jewelry | 14k Gold-Plated Statement Pieces"
        description="Discover the power of transformation with our handcrafted crystal jewelry. Each piece elevates your style and spirit, blending 14k gold-plated elegance with natural crystal beauty. Crafted with intention to empower your energy."
        keywords="crystal jewelry, 14k gold plated, statement necklaces, crystal bracelets, handcrafted jewelry, Winnipeg, crystal energy, transformation jewelry"
        url="https://trovesandcoves.ca"
        type="website"
      />

      {/* Hero Section */}
      <Hero />

      {/* Featured Collections Section */}
      <section className="chamber-section content-layer">
        <div className="chamber-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            {/* Mystical Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full"
              style={{ 
                borderColor: 'hsla(174,85%,45%,0.2)', 
                backgroundColor: 'hsla(174,85%,45%,0.05)'
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#deb55b' }} />
              <span 
                className="text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Alex Brush', cursive", color: '#e1af2f' }}
              >
                Curated With Intention
              </span>
            </div>

            <h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Libre Baskerville', serif", color: '#4abfbf' }}
            >
              Crystal Collection
            </h2>

            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif", color: '#2c6f6f' }}>
              Explore our exquisite collection of statement necklaces and bracelets.
              Each piece blends elegance with natural crystal beauty—
              crafted with intention to empower your energy and enhance your presence.
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="crystal-grid">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="crystal-card aspect-square animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-turquoise-soft border-t-[hsla(var(--accent-vibrant),0.8)] rounded-full animate-spin"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="crystal-grid">
              {featuredProducts?.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block animate-reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="crystal-card h-full p-6">
                    {/* Product Image */}
                    <div className="relative aspect-square mb-6 overflow-hidden bg-gradient-to-br from-[hsla(var(--bg-primary),0.3)] to-[hsla(var(--bg-secondary),0.5)] border border-[hsla(var(--accent-vibrant),0.1)]">
                      <img
                        src={product.imageUrl || '/api/placeholder/300/300'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[hsla(var(--bg-overlay),0.7)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Category Badge */}
                      {product.category && (
                        <div className="absolute top-3 right-3 px-3 py-1 text-xs tracking-wider uppercase bg-[hsla(var(--accent-vibrant),0.2)] border border-turquoise-soft text-turquoise-bright rounded-full backdrop-blur-sm">
                          {product.category.name}
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                      <h3 
                        className="text-xl font-semibold mb-2 group-hover:opacity-90 transition-colors duration-300"
                        style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-primary))' }}
                      >
                        {product.name}
                      </h3>

                      <p className="text-sm mb-4 line-clamp-2" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-4" style={{ borderColor: 'hsla(174,85%,45%,0.15)' }}>
                        <span 
                          className="text-lg font-semibold"
                          style={{ fontFamily: "'Libre Baskerville', serif", color: '#deb55b' }}
                        >
                          ${product.price}
                        </span>

                        <div className="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0" style={{ color: '#4abfbf' }}>
                          <span style={{ fontFamily: "'Montserrat', sans-serif" }}>View</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-16">
            <Link href="/products">
              <button 
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105"
                style={{ 
                  border: '2px solid #4abfbf',
                  backgroundColor: 'transparent',
                  color: '#4abfbf',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                <span>View All Crystal Treasures</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mystical Message Section */}
      <section className="chamber-section content-layer relative overflow-hidden">
        {/* Mystical background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-20"
            style={{ backgroundColor: 'hsla(174,85%,45%,0.03)', filter: 'blur(60px)' }}
          ></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ backgroundColor: 'hsla(43,95%,55%,0.03)', filter: 'blur(80px)' }}
          ></div>
        </div>

        <div className="chamber-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 md:p-16 rounded-2xl"
              style={{ 
                backgroundColor: 'hsla(var(--bg-primary),0.5)',
                border: '1px solid hsla(174,85%,45%,0.1)'
              }}
            >
              {/* Mystical Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full"
                style={{ 
                  border: '2px solid hsla(43,95%,55%,0.3)', 
                  backgroundColor: 'hsla(43,95%,55%,0.05)'
                }}
              >
                <Sparkles className="w-10 h-10" style={{ color: '#deb55b' }} />
              </div>

              <h2 
                className="text-3xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Libre Baskerville', serif", color: '#4abfbf' }}
              >
                Embrace Your Transformation
              </h2>

              <p className="text-lg leading-relaxed mb-8" style={{ fontFamily: "'Montserrat', sans-serif", color: '#2c6f6f' }}>
                Every crystal in our collection is chosen for its unique energy and beauty.
                When you wear our jewelry, you embrace bold femininity and masculine strength—
                statement pieces crafted with intention to empower your energy and resonate
                with abundance and confidence.
              </p>

              <p className="text-base italic" style={{ fontFamily: "'Alex Brush', cursive", color: '#e1af2f' }}>
                ✨ Handcrafted with intention in Winnipeg, Canada ✨
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
