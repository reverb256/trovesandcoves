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
            ? 'backdrop-blur-sm border-b'
            : 'bg-transparent'
        } py-4`}
        style={{
          backgroundColor: isScrolled ? 'hsl(var(--bg-card) / 0.97)' : undefined,
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
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`desktop-nav-link relative py-2 text-sm tracking-widest uppercase ${
                    isActivePath(item.path) ? 'active' : ''
                  }`}
                  style={{
                    color: isActivePath(item.path)
                      ? 'hsl(var(--accent-vibrant))'
                      : 'hsl(var(--text-primary))'
                  }}
                >
                  {item.name}
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
                  className="cart-button-glow relative p-3 rounded-lg group"
                  style={{
                    backgroundColor: 'hsl(var(--bg-card))',
                    border: '1px solid hsla(var(--accent-vibrant),0.2)',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <ShoppingCart className="w-5 h-5" style={{ color: 'hsl(var(--skull-turquoise))' }} />
                  {itemCount > 0 && (
                    <span
                      className="cart-badge absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
                      style={{
                        backgroundColor: 'hsl(var(--skull-turquoise))',
                        color: 'hsl(var(--bg-overlay))'
                      }}
                    >
                      {itemCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="menu-button lg:hidden rounded-lg"
                style={{
                  backgroundColor: 'hsl(var(--bg-card))',
                  border: '1px solid hsla(var(--accent-vibrant),0.2)',
                  transition: 'border-color 0.3s ease',
                }}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu
                  className={`menu-icon w-5 h-5 ${isMobileMenuOpen ? 'hidden' : 'visible'}`}
                  style={{ color: 'hsl(var(--skull-turquoise))' }}
                />
                <X
                  className={`menu-icon w-5 h-5 ${isMobileMenuOpen ? 'visible' : 'hidden'}`}
                  style={{ color: 'hsl(var(--skull-turquoise))' }}
                />
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
      <div
        className={`mobile-menu-overlay lg:hidden ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-menu-container" onClick={(e) => e.stopPropagation()}>
          {/* Mobile Logo */}
          <div className="mobile-menu-logo text-center">
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span
                className="text-2xl sm:text-3xl"
                style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontWeight: 700,
                  color: "hsl(var(--accent-vibrant))",
                  textTransform: "uppercase"
                }}
              >TROVES</span>
              <span
                className="text-4xl sm:text-5xl"
                style={{ fontFamily: "'Alex Brush', cursive", color: "hsl(var(--gold-medium))" }}
              >&</span>
              <span
                className="text-4xl sm:text-5xl"
                style={{ fontFamily: "'Alex Brush', cursive", color: "hsl(var(--gold-medium))" }}
              >Coves</span>
            </div>
            <p
              className="text-xs sm:text-sm tracking-widest uppercase"
              style={{
                color: "hsl(var(--text-secondary))",
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Handcrafted Crystal Jewelry
            </p>
          </div>

          {/* Mobile Navigation */}
          <nav className="mobile-menu-nav">
            {navigation.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-menu-nav-item desktop-nav-link text-xl sm:text-2xl md:text-3xl tracking-widest uppercase ${
                  isActivePath(item.path) ? 'active' : ''
                }`}
                style={{
                  color: isActivePath(item.path)
                    ? 'hsl(var(--accent-vibrant))'
                    : 'hsl(var(--text-primary))'
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Decorative Crystal */}
          <div className="mobile-menu-decoration mt-4 sm:mt-8 relative">
            <Sparkles
              className="w-8 h-8 sm:w-10 sm:h-10"
              style={{ color: 'hsl(var(--frame-gold))' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
