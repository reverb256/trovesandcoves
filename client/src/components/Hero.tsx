import { Link } from 'wouter';
import { Sparkles, Gem, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center"
      role="banner"
      aria-label="Hero Section"
    >
      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Turquoise diamonds */}
        <div className="absolute top-20 left-[10%] w-4 h-4 rotate-45 opacity-40" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}></div>
        <div className="absolute top-40 left-[15%] w-3 h-3 rotate-45 opacity-30" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}></div>
        <div className="absolute bottom-40 left-[8%] w-5 h-5 rotate-45 opacity-35" style={{ backgroundColor: 'hsl(var(--accent-vibrant))' }}></div>

        {/* Gold sparkles */}
        <div className="absolute top-32 right-[12%] text-2xl opacity-50" style={{ color: 'hsl(var(--gold-medium))' }}>✦</div>
        <div className="absolute top-60 right-[18%] text-xl opacity-40" style={{ color: 'hsl(var(--gold-medium))' }}>✦</div>
        <div className="absolute bottom-32 right-[10%] text-3xl opacity-45" style={{ color: 'hsl(var(--gold-medium))' }}>✦</div>
        <div className="absolute bottom-60 right-[22%] text-lg opacity-35" style={{ color: 'hsl(var(--gold-medium))' }}>✦</div>
      </div>

      <div className="relative z-10 w-full px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Subheader badge */}
          <div
            className="inline-flex items-center justify-center px-6 py-2 mb-8 rounded-full"
            style={{
              backgroundColor: 'hsl(var(--gold-soft))',
              color: 'hsl(var(--text-primary))',
              boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
            }}
          >
            <span className="text-sm font-medium tracking-widest uppercase">
              Winnipeg's Sacred Crystal Sanctuary
            </span>
          </div>

          {/* Brand heading - matching Header styling */}
          <h1 className="mb-4 leading-tight">
            <span className="troves-text text-5xl md:text-7xl lg:text-8xl">
              Troves
            </span>
            {' '}
            <span
              className="text-4xl md:text-6xl lg:text-7xl"
              style={{ color: 'hsl(var(--frame-gold))' }}
            >
              &
            </span>
            {' '}
            <span className="coves-text text-5xl md:text-7xl lg:text-8xl">
              Coves
            </span>
          </h1>

          {/* Secondary heading */}
          <h2
            className="text-2xl md:text-3xl lg:text-4xl mb-6 font-serif"
            style={{ color: 'hsl(var(--text-primary))' }}
          >
            Handcrafted Crystal Jewellery
          </h2>

          {/* Body text */}
          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'hsl(var(--text-secondary))' }}
          >
            Where authentic gemstone energies merge with artisan craftsmanship.
            Each piece channels crystal wisdom to amplify your inner light.
          </p>

          {/* Feature labels */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
              <Sparkles className="w-4 h-4" style={{ color: 'hsl(var(--accent-vibrant))' }} />
              <span>Sacred Wire-Wrapping</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
              <Gem className="w-4 h-4" style={{ color: 'hsl(var(--accent-vibrant))' }} />
              <span>Genuine Earth Crystals</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--text-secondary))' }}>
              <Heart className="w-4 h-4" style={{ color: 'hsl(var(--accent-vibrant))' }} />
              <span>Metaphysical Healing</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'hsl(var(--gold-medium))',
                color: 'hsl(var(--text-primary))'
              }}
            >
              Shop Crystal Necklaces
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold border-2 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: 'hsl(var(--bg-card))',
                borderColor: 'hsl(var(--border-medium))',
                color: 'hsl(var(--text-primary))'
              }}
            >
              Get Crystal Guidance
            </Link>
          </div>

          {/* Secondary links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="hover:underline" style={{ color: 'hsl(var(--text-secondary))' }}>
              <span className="mr-1">♥</span> Our Story
            </Link>
            <Link href="/jewelry-care" className="hover:underline" style={{ color: 'hsl(var(--text-secondary))' }}>
              <span className="mr-1">✦</span> Crystal Care
            </Link>
            <Link href="/contact" className="hover:underline" style={{ color: 'hsl(var(--text-secondary))' }}>
              <span className="mr-1">📍</span> Winnipeg, MB
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2" style={{ color: 'hsl(var(--accent-vibrant))' }}>
          <span className="text-xs tracking-widest">DISCOVER</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 14l-5-5h10l-5 5z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
