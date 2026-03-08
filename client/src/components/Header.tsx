import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useCartContext } from '@/lib/store';
import { SCROLL_THRESHOLD } from '@/constants';
import {
  ShoppingCart,
  Menu,
  X,
  Gem,
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
    { name: 'Collections', path: '/products' },
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[hsl(174,85%,45%)] focus:text-white focus:rounded-lg focus:shadow-lg transition-all"
      >
        Skip to main content
      </a>

      {/* Mystical Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-colors duration-500 ${
          isScrolled
            ? 'glass-mystical border-b border-crystal py-2'
            : 'bg-transparent py-4'
        }`}
      >
        {/* Mystical top border */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsla(174,85%,45%,0.5)] to-transparent"></div>

        <div className="chamber-container">
          <nav className="flex items-center justify-between">
            {/* Mystical Logo */}
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                {/* Crystal icon with glow */}
                <div className="absolute inset-0 bg-[hsla(174,85%,45%,0.3)] blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-2 border border-[hsla(174,85%,45%,0.3)] rounded-lg bg-crystal group-hover:border-[hsla(174,85%,45%,0.6)] transition-colors duration-500">
                  <Gem className="w-6 h-6 text-[hsl(174,85%,45%)]" strokeWidth={1.5} />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="troves-text text-xl">Troves</span>
                  <span className="text-[hsl(43,95%,55%)] text-2xl">×</span>
                  <span className="coves-text text-2xl">Coves</span>
                </div>
                <span className="text-xs text-[hsl(210,30%,85%)] opacity-70 tracking-widest uppercase">
                  Mystical Crystal Jewelry • Winnipeg
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative py-2 text-sm tracking-widest uppercase transition-colors duration-300 ${
                    isActivePath(item.path)
                      ? 'text-[hsl(174,85%,45%)] glow-turquoise'
                      : 'text-[hsl(210,30%,85%)] hover:text-[hsl(174,85%,45%)]'
                  }`}
                >
                  {item.name}
                  {isActivePath(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-px bg-[hsl(174,85%,45%)] shadow-[0_0_10px_hsla(174,85%,45%,0.8)]"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <Link href="/checkout">
                <button
                  aria-label="Shopping cart"
                  className="relative p-3 border border-[hsla(174,85%,45%,0.2)] rounded-lg bg-crystal hover:border-[hsla(174,85%,45%,0.5)] transition-colors duration-300 group"
                >
                  <ShoppingCart className="w-5 h-5 text-[hsl(174,85%,45%)]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-[hsl(240,15%,6%)] bg-[hsl(174,85%,45%)] rounded-full glow-turquoise">
                      {itemCount}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-[hsla(174,85%,45%,0.1)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 border border-[hsla(174,85%,45%,0.2)] rounded-lg bg-crystal hover:border-[hsla(174,85%,45%,0.5)] transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-[hsl(174,85%,45%)]" />
                ) : (
                  <Menu className="w-5 h-5 text-[hsl(174,85%,45%)]" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mystical bottom border */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsla(43,95%,55%,0.3)] to-transparent"></div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[hsla(240,15%,6%,0.95)] backdrop-blur-xl z-40 lg:hidden content-layer"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Logo */}
            <div className="text-center mb-8">
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="troves-text text-3xl">Troves</span>
                <span className="text-[hsl(43,95%,55%)] text-4xl">×</span>
                <span className="coves-text text-4xl">Coves</span>
              </div>
              <p className="text-sm text-[hsl(210,30%,85%)] opacity-60 tracking-widest uppercase">
                Mystical Crystal Jewelry
              </p>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl tracking-widest uppercase transition-colors duration-300 ${
                    isActivePath(item.path)
                      ? 'text-[hsl(174,85%,45%)] glow-turquoise'
                      : 'text-[hsl(210,30%,85%)] hover:text-[hsl(174,85%,45%)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Decorative Crystal */}
            <div className="mt-8 animate-pulse-glow">
              <Sparkles className="w-8 h-8 text-[hsl(43,95%,55%)]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
