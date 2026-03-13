import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/lib/store';
import { ThemeProvider } from '@/lib/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import PageTransition, { SectionReveal } from '@/components/PageTransition';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import SizeGuide from '@/pages/SizeGuide';
import JewelryCare from '@/pages/JewelryCare';
import Warranty from '@/pages/Warranty';
import Returns from '@/pages/Returns';
import Financing from '@/pages/Financing';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Showcase from '@/pages/Showcase';
import StyleGuide from '@/pages/StyleGuide';
import NotFound from '@/pages/not-found';
import Analytics from '@/components/Analytics';
import PerformanceMonitor from '@/components/PerformanceMonitor';

// Get base path from Vite's base config or default to '/'
const basePath = import.meta.env.BASE_URL || '/';

function Router() {
  return (
    <WouterRouter base={basePath}>
      <div className="min-h-screen">
        {/* Skip Navigation for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded focus:shadow-lg focus:font-medium"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content">
          <PageTransition>
            <SectionRevealWithKey>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/showcase" component={Showcase} />
                <Route path="/products" component={Products} />
                <Route path="/products/:category" component={Products} />
                <Route path="/product/:id" component={ProductDetail} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/order-confirmation" component={OrderConfirmation} />
                <Route path="/contact" component={Contact} />
                <Route path="/about" component={About} />
                <Route path="/size-guide" component={SizeGuide} />
                <Route path="/jewelry-care" component={JewelryCare} />
                <Route path="/warranty" component={Warranty} />
                <Route path="/returns" component={Returns} />
                <Route path="/financing" component={Financing} />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route path="/style-guide" component={StyleGuide} />
                <Route component={NotFound} />
              </Switch>
            </SectionRevealWithKey>
          </PageTransition>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </WouterRouter>
  );
}

/**
 * Wrapper component that forces SectionReveal to remount on every route change.
 * This ensures the IntersectionObserver is properly cleaned up and recreated,
 * preventing race conditions during navigation.
 */
function SectionRevealWithKey({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <SectionReveal key={location}>
      {children}
    </SectionReveal>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <CartProvider>
            <Analytics />
            <PerformanceMonitor />
            <Toaster />
            <Router />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
