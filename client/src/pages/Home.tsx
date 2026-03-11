import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import SEOHead from '@/components/SEOHead';
import Hero from '@/components/Hero';
import { WebsiteSchema, OrganizationSchema, LocalBusinessSchema } from '@/components/SchemaOrg';
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
        description="Discover handcrafted crystal jewelry with timeless elegance. Each piece elevates your style, blending 14k gold-plated sophistication with natural crystal beauty. Artisan-crafted jewelry from Winnipeg, Canada."
        keywords="crystal jewelry, 14k gold plated, statement necklaces, crystal bracelets, handcrafted jewelry, Winnipeg, artisan jewelry, canadian jewelry"
        url="https://trovesandcoves.ca"
        type="website"
      />
      <WebsiteSchema />
      <OrganizationSchema />
      <LocalBusinessSchema />

      {/* Hero Section */}
      <Hero />

      {/* Featured Collections Section */}
      <section className="chamber-section content-layer">
        <div className="chamber-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full"
              style={{ 
                borderColor: 'hsla(174,85%,45%,0.2)', 
                backgroundColor: 'hsla(174,85%,45%,0.05)'
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--gold-medium))' }} />
              <span 
                className="text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--gold-medium))', fontWeight: 600 }}
              >
                Curated With Intention
              </span>
            </div>

            <h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}
            >
              The Collection
            </h2>

            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
              Explore our curated selection of handcrafted crystal jewelry.
              Each piece blends elegance with natural crystal beauty—
              crafted with intention and designed to make a statement.
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg animate-pulse"
                  style={{ backgroundColor: 'hsl(var(--bg-card) / 0.5)', animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-turquoise-soft border-t-[hsla(var(--accent-vibrant),0.8)] rounded-full animate-spin"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group block animate-reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="rounded-lg shadow-sm hover:shadow-md transition-shadow h-full p-6" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
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
                          style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--gold-medium))' }}
                        >
                          ${product.price}
                        </span>

                        <div className="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0" style={{ color: 'hsl(var(--accent-vibrant))' }}>
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
                  border: '2px solid hsl(var(--accent-vibrant))',
                  backgroundColor: 'transparent',
                  color: 'hsl(var(--accent-vibrant))',
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                <span>View All Jewelry</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="chamber-section content-layer relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-20"
            style={{ backgroundColor: 'hsla(174,85%,45%,0.02)', filter: 'blur(60px)' }}
          ></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ backgroundColor: 'hsla(43,95%,55%,0.02)', filter: 'blur(80px)' }}
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
              {/* Decorative Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full"
                style={{ 
                  border: '2px solid hsla(43,95%,55%,0.3)', 
                  backgroundColor: 'hsla(43,95%,55%,0.05)'
                }}
              >
                <Sparkles className="w-10 h-10" style={{ color: 'hsl(var(--gold-medium))' }} />
              </div>

              <h2 
                className="text-3xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Libre Baskerville', serif", color: 'hsl(var(--accent-vibrant))' }}
              >
                Handcrafted With Intention
              </h2>

              <p className="text-lg leading-relaxed mb-8" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))' }}>
                Every crystal in our collection is chosen for its unique beauty and quality.
                Each piece is handcrafted in Winnipeg with 14k gold-plated materials
                and genuine crystals—designed to be timeless and made to stand out.
              </p>

              <p className="text-base" style={{ fontFamily: "'Montserrat', sans-serif", color: 'hsl(var(--text-secondary))', fontWeight: 500 }}>
                ✨ Handcrafted with intention in Winnipeg, Canada ✨
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
