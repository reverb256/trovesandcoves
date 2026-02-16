import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AIAssistant from "@/components/AIAssistant";
import AIAssistantDrawer from "@/components/AIAssistantDrawer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import SizeGuide from "@/pages/SizeGuide";
import JewelleryCare from "@/pages/JewelryCare";
import Warranty from "@/pages/Warranty";
import Returns from "@/pages/Returns";
import Financing from "@/pages/Financing";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <WouterRouter base="/trovesandcoves">
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/products" component={Products} />
            <Route path="/products/:category" component={Products} />
            <Route path="/product/:id" component={ProductDetail} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/order-confirmation" component={OrderConfirmation} />
            <Route path="/contact" component={Contact} />
          <Route path="/about" component={About} />
          <Route path="/size-guide" component={SizeGuide} />
          <Route path="/jewelry-care" component={JewelleryCare} />
          <Route path="/warranty" component={Warranty} />
          <Route path="/returns" component={Returns} />
          <Route path="/financing" component={Financing} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/ai-assistant" component={() => (
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-amber-500 bg-clip-text text-transparent mb-4">
                  AI Crystal Consultant
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Experience our advanced AI assistant powered by Pollinations technology. Get expert advice on crystals, 
                  generate custom product images, and receive personalized audio consultations.
                </p>
              </div>
              <AIAssistant />
            </div>
          )} />
          <Route path="/admin">
            {() => {
              const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));
              return (
                <React.Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>}>
                  <AdminDashboard />
                </React.Suspense>
              );
            }}
          </Route>
          <Route component={NotFound} />
        </Switch>
        </main>
        <Footer />
        <CartDrawer />
        <AIAssistantDrawer />
      </div>
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
