import { Switch, Route, Router as WouterRouter } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/lib/store';
import { ThemeProvider } from '@/lib/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
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

// Get base path from Vite's base config or default to '/'
const basePath = import.meta.env.BASE_URL || '/';

function Router() {
  return (
    <WouterRouter base={basePath}>
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/showcase" component={Showcase} />
            <Route path="/products" component={Products} />
            <Route path="/products/:category" component={Products} />
            <Route path="/products/:id" component={ProductDetail} />
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
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
