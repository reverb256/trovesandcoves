import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import SEOHead from '@/components/SEOHead';
import Hero from '@/components/Hero';
import SectionPill from '@/components/SectionPill';
import CTAButton from '@/components/CTAButton';
import {
  WebsiteSchema,
  OrganizationSchema,
  LocalBusinessSchema,
} from '@/components/SchemaOrg';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import type { ProductWithCategory } from '@shared/types';
import { ArrowRight, Sparkles, Gem, Truck, Shield } from 'lucide-react';
import ProductGridCard from '@/components/ProductGridCard';

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<ProductWithCategory[]>(
    {
      queryKey: ['/api/products/featured'],
    }
  );

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', path: '/' }]} />
      <SEOHead path="/" />
      <WebsiteSchema />
      <OrganizationSchema />
      <LocalBusinessSchema />

      {/* Hero Section */}
      <div className="page-section-hero">
        <Hero />
      </div>

      {/* Featured Collections Section */}
      <section className="chamber-section content-layer page-section">
        <div className="chamber-container">
          {/* Section Header - More Spacious */}
          <div className="text-center mb-20">
            {/* Badge */}
            <SectionPill variant="turquoise" className="mb-8">
              Curated With Intention
            </SectionPill>

            <h2
              className="text-5xl md:text-7xl font-bold mb-8"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                color: 'hsl(var(--accent-vibrant))',
              }}
            >
              The Collection
            </h2>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: 'hsl(var(--text-secondary))',
              }}
            >
              Explore our curated selection of handcrafted crystal jewelry. Each
              piece blends elegance with natural crystal beauty— crafted with
              intention and designed to make a statement.
            </p>

            {/* Premium Section Divider */}
            <div
              className="premium-section-divider"
              style={{ marginTop: '3rem' }}
            />
          </div>

          {/* Products Grid - Enhanced Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg animate-pulse"
                  style={{
                    backgroundColor: 'hsl(var(--bg-card) / 0.5)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-turquoise-soft border-t-[hsla(var(--accent-vibrant),0.8)] rounded-full animate-spin"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProducts?.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-reveal product-card-stagger"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductGridCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* View All Button */}
          <div className="text-center mt-20">
            <CTAButton variant="secondary" href="/products" className="group">
              <span>View All Jewelry</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="chamber-section content-layer page-section relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full opacity-20"
            style={{
              backgroundColor: 'hsla(174,85%,45%,0.02)',
              filter: 'blur(60px)',
            }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              backgroundColor: 'hsla(43,95%,55%,0.02)',
              filter: 'blur(80px)',
            }}
          ></div>
        </div>

        <div className="chamber-container relative">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <SectionPill variant="gold" className="mb-6">
                The Experience
              </SectionPill>
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  color: 'hsl(var(--accent-vibrant))',
                }}
              >
                Crafted With Intention
              </h2>
              <div className="premium-section-divider" />
            </div>

            {/* Benefits Grid */}
            <div className="benefits-section">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="benefit-title">Intentional Design</h4>
                  <p className="benefit-description">
                    Each piece is crafted with purpose and positive energy to
                    support your journey
                  </p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Gem className="w-6 h-6" />
                  </div>
                  <h4 className="benefit-title">Natural Crystals</h4>
                  <p className="benefit-description">
                    Genuine gemstones sourced ethically for their unique beauty
                    and energy
                  </p>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="benefit-title">Lifetime Care</h4>
                  <p className="benefit-description">
                    Warranty and repair service included with every piece
                  </p>
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div className="story-section">
              <h3>Handcrafted in Winnipeg, Canada</h3>
              <p>
                Every crystal in our collection is chosen for its unique beauty
                and quality. Each piece is handcrafted with 14k gold-plated
                materials and genuine crystals— designed to be timeless and made
                to stand out.
              </p>
              <p>
                We believe in the power of intention. From the moment we select
                each stone to the final polish, your jewelry is infused with
                positive energy and care. Wear it as a reminder of your own
                inner strength and beauty.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <div className="trust-badge-icon">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="trust-badge-text">Free Shipping</span>
              </div>
              <div className="trust-badge">
                <div className="trust-badge-icon">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="trust-badge-text">Lifetime Warranty</span>
              </div>
              <div className="trust-badge">
                <div className="trust-badge-icon">
                  <Gem className="w-5 h-5" />
                </div>
                <span className="trust-badge-text">Handcrafted</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
