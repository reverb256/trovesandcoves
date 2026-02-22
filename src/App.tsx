import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Hero = lazy(() => import('./components/Hero'));
const Dashboard = lazy(() => import('./components/Dashboard'));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface-50">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">💎</div>
            <p className="text-on-surface-variant">Loading Troves & Coves...</p>
          </div>
        </div>
      }>
        <div>
          <Hero />
          <Dashboard />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
