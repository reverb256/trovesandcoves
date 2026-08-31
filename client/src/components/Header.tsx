import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BRAND_CONFIG } from '@shared/brand-config';
import { Menu, X } from 'lucide-react';
import { SCROLL_THRESHOLD } from '@/constants';

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        style={{ backgroundColor: BRAND_CONFIG.colors.trovesTurquoise, color: 'white' }}
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
                  <span
                    style={{
                      fontFamily: "'Libre Baskerville', serif",
                      fontWeight: 700,
                      color: BRAND_CONFIG.colors.trovesTurquoise,
                      textTransform: 'uppercase'
                    }}
                    className="text-lg"
                  >
                    TROVES
                  </span>
                  <span
                    className="text-2xl"
                    style={{
                      fontFamily: "'Alex Brush', cursive",
                      color: BRAND_CONFIG.colors.covesGold
                    }}
                  >
                    &
                  </span>
                  <span
                    style={{
                      fontFamily: "'Alex Brush', cursive",
                      color: BRAND_CONFIG.colors.covesGold
                    }}
                    className="text-2xl"
                  >
                    COVES
                  </span>
                </div>
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{
                    color: BRAND_CONFIG.colors.textSecondary,
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  Handcrafted Crystal Jewelry • Winnipeg
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link
                href="/about"
                className={`relative py-2 text-sm tracking-widest uppercase ${
                  isActivePath('/about') ? 'active' : ''
                }`}
                style={{
                  color: isActivePath('/about')
                    ? BRAND_CONFIG.colors.trovesTurquoise
                    : BRAND_CONFIG.colors.textPrimary
                }}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`relative py-2 text-sm tracking-widest uppercase ${
                  isActivePath('/contact') ? 'active' : ''
                }`}
                style={{
                  color: isActivePath('/contact')
                    ? BRAND_CONFIG.colors.trovesTurquoise
                    : BRAND_CONFIG.colors.textPrimary
                }}
              >
                Contact
              </Link>
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="menu-button rounded-lg"
                style={{
                  backgroundColor: 'hsl(var(--bg-card))',
                  border: '1px solid hsla(var(--accent-vibrant),0.2)',
                  transition: 'border-color 0.3s ease',
                }}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu
                  className={`menu-icon w-5 h-5 ${isMobileMenuOpen ? 'hidden' : 'visible'}`}
                  style={{ color: BRAND_CONFIG.colors.trovesTurquoise }}
                />
                <X
                  className={`menu-icon w-5 h-5 ${isMobileMenuOpen ? 'visible' : 'hidden'}`}
                  style={{ color: BRAND_CONFIG.colors.trovesTurquoise }}
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
        id="mobile-menu"
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
                  color: BRAND_CONFIG.colors.trovesTurquoise,
                  textTransform: 'uppercase'
                }}
              >
                TROVES
              </span>
              <span
                className="text-4xl sm:text-5xl"
                style={{
                  fontFamily: "'Alex Brush', cursive",
                  color: BRAND_CONFIG.colors.covesGold
                }}
              >
                &
              </span>
              <span
                className="text-4xl sm:text-5xl"
                style={{
                  fontFamily: "'Alex Brush', cursive",
                  color: BRAND_CONFIG.colors.covesGold
                }}
              >
                COVES
              </span>
            </div>
            <p
              className="text-xs sm:text-sm tracking-widest uppercase"
              style={{
                color: BRAND_CONFIG.colors.textSecondary,
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Handcrafted Crystal Jewelry
            </p>
          </div>

          {/* Mobile Navigation */}
          <nav className="mobile-menu-nav">
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-menu-nav-item text-xl sm:text-2xl md:text-3xl tracking-widest uppercase ${
                isActivePath('/about') ? 'active' : ''
              }`}
              style={{
                color: isActivePath('/about')
                  ? BRAND_CONFIG.colors.trovesTurquoise
                  : BRAND_CONFIG.colors.textPrimary
              }}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mobile-menu-nav-item text-xl sm:text-2xl md:text-3xl tracking-widest uppercase ${
                isActivePath('/contact') ? 'active' : ''
              }`}
              style={{
                color: isActivePath('/contact')
                  ? BRAND_CONFIG.colors.trovesTurquoise
                  : BRAND_CONFIG.colors.textPrimary
              }}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
