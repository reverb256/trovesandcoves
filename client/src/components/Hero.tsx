import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden content-layer"
      role="banner"
      aria-label="Hero Section"
    >
      {/* Mystical Background Effects */}
      <div className="absolute inset-0">
        {/* Radial glow from center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsla(174,85%,45%,0.05)] rounded-full blur-3xl animate-glow-breathe"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[hsla(43,95%,55%,0.03)] rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsla(200,70%,50%,0.03)] rounded-full blur-3xl animate-glow-breathe" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Crystal Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[hsla(174,85%,45%,0.6)] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <div
            key={`gold-${i}`}
            className="absolute w-1 h-1 bg-[hsla(43,95%,55%,0.5)] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="chamber-container relative z-10">
        <div className="max-w-4xl">
          {/* Mystical Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[hsla(174,85%,45%,0.3)] rounded-full bg-crystal animate-reveal">
            <Sparkles className="w-4 h-4 text-[hsl(174,85%,45%)]" />
            <span className="text-xs tracking-widest uppercase text-[hsl(210,30%,85%)]">
              Handcrafted in Winnipeg
            </span>
          </div>

          {/* Main Heading - Preserving mystical brand voice */}
          <h1 className="mb-6 animate-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="text-shimmer text-5xl md:text-7xl lg:text-8xl font-bold">
              Where Crystal{" "}
            </span>
            <br />
            <span className="text-shimmer text-5xl md:text-7xl lg:text-8xl font-bold">
              Wisdom Meets{" "}
            </span>
            <span className="relative inline-block">
              <span className="text-glow-turquoise text-6xl md:text-8xl lg:text-9xl font-bold">
                Artisan Beauty
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsla(174,85%,45%,0.6)] to-transparent"></span>
            </span>
          </h1>

          {/* Mystical Description - Preserving brand voice */}
          <p className="text-xl md:text-2xl text-[hsl(210,30%,85%)] opacity-80 mb-12 max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Authentic gemstone energies merge with artisan craftsmanship.
            Each piece channels crystal wisdom to amplify your inner light,
            promote healing, and bring beauty to your life.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link href="/products">
              <button className="btn-mystical group">
                <span>Explore Crystal Collections</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
            <Link href="/about">
              <button className="btn-mystical-outline">
                <span>Our Spiritual Story</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Crystal Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[hsl(174,85%,45%)]">
          <path
            d="M50 0 L100 50 L50 100 L0 50 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="animate-[rotate-slow_20s_linear_infinite]"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-40 h-40 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[hsl(43,95%,55%)]">
          <path
            d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="animate-[rotate-slow_25s_linear_infinite_reverse]"
          />
        </svg>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-widest uppercase text-[hsl(210,30%,85%)] opacity-50">
          Discover More
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[hsla(174,85%,45%,0.5)] to-transparent"></div>
      </div>
    </section>
  );
}
