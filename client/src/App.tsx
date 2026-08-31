import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/lib/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition, { SectionReveal } from '@/components/PageTransition';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from '@/pages/not-found';
import Analytics from '@/components/Analytics';

// Get base path from Vite's base config or default to '/'
const basePath = import.meta.env.BASE_URL || '/';

function Router() {
  return (
    <WouterRouter base={basePath}>
      <div className="min-h-screen">
        <Header />
        <main id="main-content">
          <PageTransition>
            <SectionRevealWithKey>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/privacy-policy" component={PrivacyPolicy} />
                <Route component={NotFound} />
              </Switch>
            </SectionRevealWithKey>
          </PageTransition>
        </main>
        <Footer />
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
          <Toaster />
          <Analytics />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
