import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCartContext } from '@/lib/store';
import { SCROLL_THRESHOLD } from '@/constants';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ShoppingCart,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export default function Header() {
  const [location] = useLocation();
  const { itemCount } = useCartContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Skip Navigation Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg transition-all"
        style={{ backgroundColor: 'hsl(var(--skull-turquoise))', color: 'white' }}
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-colors duration-500 ${
          isScrolled
            ? 'backdrop-blur-sm border-b py-2'
            : 'bg-transparent py-4'
        }`}
        style={{
          backgroundColor: isScrolled ? 'hsl(var(--bg-card) / 0.9)' : undefined,
          borderColor: isScrolled ? 'hsla(176, 42%, 39%, 0.2)' : undefined
        }}
      >
        {/* Top border accent */}
        <div className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, hsla(176, 42%, 39%, 0.5), transparent)' }}
        ></div>

        <div className="chamber-container">
          <nav className="flex items-center justify-between" aria-label="Main navigation">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                {/* Gem icon with glow */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ backgroundColor: 'hsla(var(--skull-turquoise),0.3)', filter: 'blur(20px)' }}
                ></div>
                <svg width="36" height="36" viewBox="0 0 24 24" className="overflow-visible" fill="none">
                  <defs>
                    <radialGradient id="headerGemGradient" cx="20%" cy="20%" r="70%">
                      <stop offset="0%" stopColor="hsl(var(--gold-medium))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(var(--gold-medium))" stopOpacity="0.3" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M6 3h12l4 6-10 13L2 9l4-6Z"
                    stroke="url(#headerGemGradient)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill="url(#headerGemGradient)"
                    fillOpacity="0.1"
                  />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-end gap-2">
                  <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: "hsl(var(--accent-vibrant))", textTransform: "uppercase" }} className="text-lg">TROVES</span>
                  <span className="text-2xl" style={{ fontFamily: "'Alex Brush', cursive", color: "hsl(var(--gold-medium))" }}>&</span>
                  <span style={{ fontFamily: "'Alex Brush', cursive", color: "hsl(var(--gold-medium))" }} className="text-2xl">Coves</span>
                </div>
                <span className="text-xs tracking-widest uppercase"
                  style={{ color: "hsl(var(--text-secondary))", fontFamily: "'Montserrat', sans-serif" }}
                >
                  Handcrafted Crystal Jewelry • Winnipeg
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative py-2 text-sm tracking-widest uppercase transition-colors duration-300"
                  style={{
                    color: isActivePath(item.path)
                      ? 'hsl(var(--accent-vibrant))'
                      : 'hsl(var(--text-primary))'
                  }}
                  onMouseEnter={(e) => !isActivePath(item.path) && (e.currentTarget.style.color = 'hsl(var(--accent-vibrant))')}
                  onMouseLeave={(e) => !isActivePath(item.path) && (e.currentTarget.style.color = 'hsl(var(--text-primary))')}
                >
                  {item.name}
                  {isActivePath(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-px"
                      style={{
                        backgroundColor: 'hsl(var(--accent-vibrant))',
                        boxShadow: '0 0 10px hsl(var(--accent-vibrant))'
                      }}
                    ></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart Button */}
              <Link href="/checkout">
                <button
                  aria-label="Shopping cart"
                  className="relative p-3 rounded-lg transition-colors duration-300 group"
                  style={{
                    backgroundColor: 'hsl(var(--bg-card))',
                    border: '1px solid hsla(var(--accent-vibrant),0.2)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'hsla(var(--skull-turquoise),0.5)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'hsla(var(--accent-vibrant),0.2)'}
                >
                  <ShoppingCart className="w-5 h-5" style={{ color: 'hsl(var(--skull-turquoise))' }} />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full glow-turquoise"
                      style={{
                        backgroundColor: 'hsl(var(--skull-turquoise))',
                        color: 'hsl(var(--bg-overlay))'
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: 'hsla(var(--accent-vibrant),0.1)' }}
                  ></div>
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: 'hsl(var(--bg-card))',
                  border: '1px solid hsla(var(--accent-vibrant),0.2)'
                }}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" style={{ color: 'hsl(var(--skull-turquoise))' }} />
                ) : (
                  <Menu className="w-5 h-5" style={{ color: 'hsl(var(--skull-turquoise))' }} />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, hsla(43,78%,53%,0.4), transparent)' }}
        ></div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-40 lg:hidden content-layer"
          style={{ backgroundColor: 'hsla(var(--bg-secondary),0.95)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Logo */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: "hsl(var(--accent-vibrant))", textTransform: "uppercase" }} className="text-2xl">TROVES</span>
                <span className="text-4xl" style={{ fontFamily: "'Alex Brush', cursive", color: "hsl(var(--gold-medium))" }}>&</span>
                <span style={{ fontFamily: "'Alex Brush', cursive", color: "hsl(var(--gold-medium))" }} className="text-4xl">Coves</span>
              </div>
              <p className="text-sm tracking-widest uppercase"
                style={{ color: "hsl(var(--text-secondary))", fontFamily: "'Montserrat', sans-serif" }}
              >
                Handcrafted Crystal Jewelry
              </p>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl tracking-widest uppercase transition-colors duration-300"
                  style={{
                    color: isActivePath(item.path)
                      ? 'hsl(var(--accent-vibrant))'
                      : 'hsl(var(--text-primary))'
                  }}
                  onMouseEnter={(e) => !isActivePath(item.path) && (e.currentTarget.style.color = 'hsl(var(--accent-vibrant))')}
                  onMouseLeave={(e) => !isActivePath(item.path) && (e.currentTarget.style.color = 'hsl(var(--text-primary))')}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Decorative Crystal */}
            <div className="mt-8 relative animate-pulse-glow">
              {/* Circular glow background */}
              <div className="absolute inset-0 rounded-full blur-xl"
                style={{ backgroundColor: 'hsla(var(--frame-gold),0.3)' }}
              ></div>
              <Sparkles className="w-8 h-8 relative z-10" style={{ color: 'hsl(var(--frame-gold))' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
