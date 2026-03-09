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
        title="Troves & Coves - Mystical Crystal Jewelry | Authentic Gemstone Healing Talismans"
        description="Where authentic gemstone energies merge with artisan craftsmanship. Discover handcrafted crystal jewelry, wire-wrapped pendants, and healing talismans. Each piece channels crystal wisdom to amplify your inner light."
        keywords="crystal jewelry, gemstone healing, wire-wrapped pendants, crystal wisdom, artisan jewelry, Winnipeg, spiritual jewelry, healing crystals"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-turquoise-soft rounded-full bg-crystal">
              <Sparkles className="w-4 h-4 text-turquoise-bright" />
              <span className="text-xs tracking-widest uppercase text-[hsl(var(--text-secondary))]">
                Curated With Intention
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-shimmer">Crystal Collection</span>
            </h2>

            <p className="text-lg text-[hsl(var(--text-secondary))] opacity-70 max-w-2xl mx-auto">
              Explore our curated collection of authentic gemstone jewelry,
              wire-wrapped pendants, and healing talismans. Each piece is
              artisan-crafted to amplify your energy and style.
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
                      <h3 className="text-xl font-semibold text-[hsl(var(--text-secondary))] mb-2 group-hover:text-turquoise-bright transition-colors duration-300">
                        {product.name}
                      </h3>

                      <p className="text-sm text-[hsl(var(--text-secondary))] opacity-60 mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-[hsla(var(--accent-vibrant),0.1)]">
                        <span className="text-lg font-semibold text-gold-bright glow-gold">
                          ${product.price}
                        </span>

                        <div className="flex items-center gap-1 text-xs text-turquoise-bright opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                          <span>View</span>
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
              <button className="btn-mystical-outline group">
                <span>View All Crystal Treasures</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mystical Message Section */}
      <section className="chamber-section content-layer relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[hsla(var(--accent-soft),0.05)] via-transparent to-[hsla(var(--gold-soft),0.05)]"></div>

        <div className="chamber-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="crystal-card p-12 md:p-16">
              {/* Mystical Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 mb-8 border-2 border-gold-soft rounded-full bg-[hsla(var(--gold-soft),0.05)] animate-pulse-glow">
                <Sparkles className="w-10 h-10 text-gold-bright" />
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="text-shimmer">Channel Your Inner Light</span>
              </h2>

              <p className="text-lg text-[hsl(var(--text-secondary))] opacity-70 leading-relaxed mb-8">
                Every crystal in our collection has been intuitively selected for its
                unique healing properties and energetic vibrations. When you wear
                our jewelry, you carry the ancient wisdom of the earth with you—
                amplifying your intentions, supporting your journey, and connecting
                you to the mystical energies that surround us all.
              </p>

              <p className="text-base text-[hsl(var(--text-secondary))] opacity-50 italic">
                ✨ Handcrafted with intention in Winnipeg, Canada ✨
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
