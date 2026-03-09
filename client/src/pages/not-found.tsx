import { Gem, Home, Search, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mystical-gradient flex items-center justify-center px-4 content-layer">
      {/* Mystical 404 Card */}
      <div className="crystal-card w-full max-w-lg p-12 text-center">
        {/* Mystical Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-turquoise-soft bg-turquoise-soft">
            <Gem className="w-12 h-12 text-turquoise-bright" strokeWidth={1.5} />
          </div>
        </div>

        {/* Mystical Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-gold-soft rounded-full bg-gold-soft">
          <span className="text-xs tracking-widest uppercase text-gold-bright">
            404
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-glow-turquoise mb-6">
          Lost in the Void
        </h1>

        {/* Mystical Divider */}
        <div className="w-24 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-[hsla(var(--accent-vibrant),0.5)] to-transparent"></div>

        <p className="text-lg text-[hsl(var(--text-secondary))] opacity-70 mb-8 leading-relaxed">
          The crystal path you seek has faded into the mists.
          Let us guide you back to the treasures that await.
        </p>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link href="/">
            <button className="btn-mystical w-full justify-center group">
              <Home className="w-5 h-5 mr-2" />
              <span>Return to the Sanctuary</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>

          <Link href="/products">
            <button className="btn-mystical-outline w-full justify-center">
              <Search className="w-5 h-5 mr-2" />
              <span>Explore Crystal Collections</span>
            </button>
          </Link>
        </div>

        {/* Mystical Glow */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-[hsla(var(--accent-vibrant),0.2)] rounded-full blur-xl"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[hsla(var(--accent-vibrant),0.3)] rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
