import { Link } from 'wouter';

// Import different Hero versions as components
const HeroVersions = {
  earliest: {
    name: "June 2025 - 'Showcase Luxury Brand' (Earliest)",
    commit: "063c27d",
    description: "Full-screen background image with navy overlay. Classic luxury jewelry aesthetic.",
    hero: (
      <section className="relative bg-navy overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/90 to-slate-900/90"></div>
        <div className="relative container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              Timeless <span className="text-yellow-400">Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Discover exquisite jewelry crafted with passion in the heart of Winnipeg.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full transition-colors">
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  },

  framerMotion: {
    name: "June 2025 - 'Modern 2025 Stack + Framer Motion'",
    commit: "b6f7af0",
    description: "Animated gradient background (blue to purple) with Framer Motion animations and floating crystals.",
    hero: (
      <section className="min-h-[60vh] flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
        <div className="relative z-10 text-center text-white p-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Troves & Coves
          </h1>
          <p className="text-lg md:text-xl mb-8 text-purple-100">
            Handcrafted crystal jewelry & artisan gemstone pieces in Winnipeg.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/products" className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-full shadow-lg font-semibold">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>
    )
  },

  minimalist: {
    name: "June 2025 - 'Simplify and Refine' (Minimalist)",
    commit: "3b75f79",
    description: "Clean white/turquoise gradient with badge, feature pills, and extensive content layout.",
    hero: (
      <section className="relative flex items-center justify-center overflow-hidden py-16 min-h-[60vh]" style={{ background: 'linear-gradient(135deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 50%, hsl(var(--bg-tertiary)) 100%)' }}>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 px-6 py-2 mb-8 rounded-full shadow-sm text-sm" style={{
            backgroundColor: 'hsl(var(--gold-soft))',
            color: 'hsl(var(--text-primary))',
            boxShadow: '0 2px 8px hsla(var(--gold-medium), 0.3)'
          }}>
            <span>✦</span>
            <span className="font-medium tracking-widest uppercase">Authentic Canadian Crystal Artistry</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4" style={{ color: 'hsl(var(--accent-medium))' }}>
            Troves <span className="mx-2" style={{
              background: 'linear-gradient(90deg, hsl(var(--accent-vibrant)) 0%, hsl(var(--gold-vibrant)) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>&</span> Coves
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-6" style={{ color: 'hsl(var(--gold-medium))' }}>
            Handcrafted Crystal Jewellery
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-10" style={{ color: 'hsla(var(--text-secondary), 0.8)' }}>
            Natural gemstone beauty meets artisan craftsmanship.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-sm" style={{
              backgroundColor: 'hsla(var(--bg-card), 0.7)',
              borderColor: 'hsla(var(--gold-soft), 0.2)'
            }}>
              <span>✦</span>
              <span>Wire-Wrapped</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-sm" style={{
              backgroundColor: 'hsla(var(--bg-card), 0.7)',
              borderColor: 'hsla(var(--gold-soft), 0.2)'
            }}>
              <span>◆</span>
              <span>Earth Crystals</span>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link to="/products" className="px-6 py-3 rounded-full shadow-lg font-semibold" style={{
              backgroundColor: 'hsl(var(--accent-vibrant))',
              color: 'white'
            }}>
              Shop Crystal Necklaces
            </Link>
            <Link to="/about" className="border-2 px-6 py-3 rounded-full font-semibold" style={{
              borderColor: 'hsla(var(--gold-soft), 0.4)',
              color: 'hsl(var(--accent-medium))',
              backgroundColor: 'hsla(var(--bg-card), 0.8)'
            }}>
              Our Story
            </Link>
          </div>
        </div>
      </section>
    )
  },

  classicDark: {
    name: "June 2025 - 'Restore Classic Hero'",
    commit: "a3237fc",
    description: "Simple dark navy background with elegant gold accents. Clean and straightforward.",
    hero: (
      <section className="relative bg-slate-900 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute w-2 h-2 bg-yellow-500 rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-2 h-2 bg-yellow-500 rounded-full top-1/2 left-1/3 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-2 h-2 bg-yellow-500 rounded-full bottom-10 right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Troves <span className="text-yellow-400">& Coves</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Handcrafted crystal jewelry and artisan gemstone pieces in Winnipeg.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors">
                Browse our crystal jewelry
              </Link>
              <Link to="/about" className="border-2 border-teal-500 text-teal-400 px-6 py-3 rounded-lg hover:bg-teal-900/30 transition-colors">
                Learn more about our story
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  },

  brandGradient: {
    name: "Feb 2026 - 'Modernize with Brand Colors' (Dark Gradient)",
    commit: "72708db",
    description: "Deep gradient (turquoise → blue → gold) with floating gold accents and dark overlay.",
    hero: (
      <section className="relative overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0" style={{
          background: 'linear-gradient(135deg, hsl(var(--bg-primary)) 0%, hsl(var(--bg-secondary)) 25%, hsl(var(--bg-tertiary)) 75%, hsl(var(--bg-tertiary)) 100%)'
        }}></div>
        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full top-10 left-10 animate-pulse"></div>
        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full top-1/3 left-1/4 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full top-2/3 left-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 z-10 bg-black/30"></div>
        <div className="container mx-auto px-4 z-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Troves <span className="text-yellow-400">& Coves</span>
            </h1>
            <p className="text-lg md:text-xl text-teal-300 mb-8">
              Handcrafted crystal jewelry and artisan gemstone pieces in Winnipeg.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 px-8 py-4 rounded-full font-semibold">
                Browse our crystal jewelry
              </Link>
              <Link to="/about" className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 px-8 py-4 rounded-full">
                Learn more about our story
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }
};

export default function Showcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-teal-600 dark:text-teal-400 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Hero Section Showcase
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            A visual journey through the evolution of Troves & Coves hero sections
          </p>
        </div>
      </div>

      {/* Hero Versions */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {(Object.entries(HeroVersions) as [string, typeof HeroVersions[keyof typeof HeroVersions]][]).map(
          ([key, version], index) => (
            <div key={key} className="scroll-mt-16" id={key}>
              {/* Version Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium">
                    Version {index + 1}
                  </span>
                  <span className="text-slate-500 dark:text-slate-500 font-mono text-sm">
                    {version.commit}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {version.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  {version.description}
                </p>
              </div>

              {/* Hero Preview */}
              <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
                {version.hero}
              </div>

              {/* Action Links */}
              <div className="mt-4 flex gap-3">
                <code className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                  git show {version.commit}:client/src/components/Hero.tsx
                </code>
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-500 dark:text-slate-500">
          <p>Choose your favorite hero section and let us know!</p>
          <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">
            Contact us to implement
          </Link>
        </div>
      </div>
    </div>
  );
}
