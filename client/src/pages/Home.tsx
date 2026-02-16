import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEOHead from '@/components/SEOHead';
import Hero from '@/components/Hero';
import type { ProductWithCategory } from '@shared/schema';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<ProductWithCategory[]>(
    {
      queryKey: ['/api/products/featured'],
    }
  );

  return (
    <>
      <SEOHead
        title="Troves & Coves - Crystal Jewelry | Shop Winnipeg's Mystical Gemstone Collection"
        description="Discover handcrafted crystal jewelry, wire-wrapped pendants, and healing gemstone talismans. Shop our curated collection of necklaces, bracelets, and spiritual gifts. Ethically sourced, artisan made in Winnipeg."
        keywords="crystal jewelry, shop, Winnipeg, gemstone, necklace, bracelet, wire wrapped, healing, spiritual gifts"
        url="https://trovesandcoves.ca"
        type="website"
      />

      {/* Hero Section */}
      <Hero />

      {/* Shop Jewelry Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white via-troves-turquoise/5 to-gold-50 relative">
        <div className="container-jewelry">
          <div className="text-center mb-14">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-4 tracking-tight text-troves-turquoise drop-shadow-lg">
              Shop{' '}
              <span className="bg-gradient-to-r from-troves-turquoise to-gold-400 bg-clip-text text-transparent">
                Crystal Jewelry
              </span>
            </h2>
            <p className="text-lg md:text-xl text-troves-turquoise/80 max-w-2xl mx-auto">
              Explore our curated collection of authentic gemstone jewelry,
              wire-wrapped pendants, and healing talismans. Each piece is
              artisan-crafted to amplify your energy and style.
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="adaptive-grid">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="card-crystal p-6 card-uniform shimmer-effect"
                >
                  <div className="animate-pulse">
                    <div className="h-40 bg-gradient-to-br from-stone-200 to-stone-100 rounded-lg mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded mb-2"></div>
                    <div className="h-3 bg-stone-100 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="adaptive-grid">
              {featuredProducts?.map(product => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="rounded-3xl border border-gold-100 bg-white/80 shadow-lg hover:shadow-xl transition-all duration-500 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-troves-turquoise/10 to-gold-50">
                        <img
                          src={product.imageUrl || '/api/placeholder/300/300'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-2xl font-serif font-semibold mb-2 group-hover:text-troves-turquoise transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-troves-turquoise/80 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gold-500">
                          ${product.price}
                        </span>
                        {product.category && (
                          <Badge className="bg-gold-50 border border-gold-200 text-troves-turquoise text-xs rounded-full px-3 py-1">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* View All Link */}
          <div className="text-center mt-14">
            <Link href="/products">
              <Button className="bg-troves-turquoise hover:bg-troves-turquoise/90 text-white text-lg px-8 py-4 rounded-full shadow-lg font-semibold transition-all duration-300 border-2 border-gold-200">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
