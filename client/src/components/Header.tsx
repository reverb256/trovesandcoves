import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useCartContext } from '@/lib/store';
import { ShoppingCart, Menu, Gem, Star, Search, ArrowRight } from 'lucide-react';
import SkullIcon from '@/components/SkullIcon';

export default function Header() {
  const [location] = useLocation();
  const { itemCount } = useCartContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'Shop', 
      path: '/products',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Products', path: '/products', icon: '✨' },
        { name: 'Crystal Necklaces', path: '/products/crystal-necklaces', icon: '💎' },
        { name: 'Healing Crystals', path: '/products/healing-crystals', icon: '🔮' },
        { name: 'Wire Wrapped', path: '/products/wire-wrapped', icon: '🌀' },
        { name: 'Best Sellers', path: '/products/featured', icon: '⭐' }
      ]
    },
    { name: 'Crystal Guide', path: '/ai-assistant' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Luxury Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 will-change-transform ${
          isScrolled 
            ? 'glass-card backdrop-blur-xl border-b border-ornate-frame-gold/20' 
            : 'bg-transparent'
        }`}
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="absolute top-0 left-0 w-full h-0.5 accent-tri-gradient"></div>
        <div className="container-luxury">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 gold-glow rounded-full opacity-20"></div>
                <SkullIcon size={32} className="text-troves-turquoise relative z-10 float-animation" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="troves-text-style">Troves</span>
                  <span className="and-text-style mx-2" style={{ fontFamily: '"Dancing Script", "Playfair Display", "cursive", "serif"', fontWeight: 700, fontSize: '1.2em', background: 'linear-gradient(90deg, #14b8a6 0%, #ffd700 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', verticalAlign: 'middle' }}>&</span>
                  <span className="coves-text-style">Coves</span>
                </span>
                <span className="text-xs text-muted-foreground -mt-1 tracking-widest uppercase">
                  Mystical Crystal Jewellery • Winnipeg
                </span>
              </div>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.path} className="relative group">
                  {item.hasDropdown ? (
                    <>
                      <button
                        className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center space-x-1 ${
                          isActivePath(item.path)
                            ? 'text-primary'
                            : 'text-foreground hover:text-primary'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ArrowRight className="h-3 w-3 rotate-90 transition-transform group-hover:rotate-180" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-[100]">
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-1 backdrop-blur-sm">
                          {item.dropdownItems?.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.path}
                              href={dropdownItem.path}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-turquoise-600 hover:bg-turquoise-50 dark:hover:bg-turquoise-900/20 rounded-md transition-all duration-200 group/item"
                            >
                              <span className="text-base">{dropdownItem.icon}</span>
                              <span className="group-hover/item:translate-x-0.5 transition-transform font-medium">
                                {dropdownItem.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.path}
                      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                        isActivePath(item.path)
                          ? 'text-primary'
                          : 'text-foreground hover:text-primary'
                      }`}
                    >
                      {item.name}
                      <span 
                        className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-primary/50 transition-all duration-300 ${
                          isActivePath(item.path) 
                            ? 'scale-x-100' 
                            : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex items-center space-x-2 glass hover:glass-card transition-all duration-300"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search</span>
              </Button>

              {/* Cart Button */}
              <Link href="/checkout">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative glass hover:glass-card transition-all duration-300"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge 
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground gold-glow"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden glass hover:glass-card"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 w-80 text-gray-900 dark:text-gray-100">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Navigate through the Troves & Coves crystal jewelry website sections
                  </SheetDescription>
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center space-x-3 pb-8 border-b border-gray-200 dark:border-gray-700">
                      <Gem className="h-6 w-6 text-turquoise-600" />
                      <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          <span className="text-turquoise-600">Troves</span>
                          <span className="text-amber-600 mx-1">&</span>
                          <span className="text-blue-600">Coves</span>
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Crystal Jewelry • Winnipeg</p>
                      </div>
                    </div>

                    {/* Mobile Navigation with Enhanced UX */}
                    <nav className="flex-1 space-y-2 pt-6">
                      {navigation.map((item) => (
                        <div key={item.path}>
                          {item.hasDropdown ? (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-turquoise-50 to-blue-50 border border-turquoise-100">
                                <span className="font-semibold text-turquoise-700 flex items-center">
                                  <span className="text-lg mr-2">✨</span>
                                  {item.name}
                                </span>
                              </div>
                              <div className="pl-4 space-y-1">
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.path}
                                    href={dropdownItem.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 p-3 ml-2 rounded-md text-gray-600 hover:bg-turquoise-50 hover:text-turquoise-600 transition-all duration-200 group"
                                  >
                                    <span className="text-sm">{dropdownItem.icon}</span>
                                    <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
                                      {dropdownItem.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <Link
                              href={item.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 group ${
                                isActivePath(item.path)
                                  ? 'bg-turquoise-50 text-turquoise-700 border-l-4 border-turquoise-500'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-turquoise-600'
                              }`}
                            >
                              <span className="font-medium">{item.name}</span>
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          )}
                        </div>
                      ))}
                      
                      {/* Quick Actions Section */}
                      <div className="pt-4 mt-6 border-t border-gray-200">
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3 px-4">
                          Quick Actions
                        </p>
                        <div className="space-y-2">
                          <Link
                            href="/ai-assistant"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 hover:from-purple-100 hover:to-indigo-100 transition-all duration-200"
                          >
                            <span className="text-lg">🔮</span>
                            <span className="font-medium">Get Crystal Guidance</span>
                          </Link>
                          <Link
                            href="/contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 hover:from-amber-100 hover:to-orange-100 transition-all duration-200"
                          >
                            <span className="text-lg">💌</span>
                            <span className="font-medium">Connect with Us</span>
                          </Link>
                        </div>
                      </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Premium Quality</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          Winnipeg Local
                        </Badge>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>

        {/* Premium Underline Effect */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
