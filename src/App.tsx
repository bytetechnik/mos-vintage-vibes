import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from 'react';
import heroStreet1 from './assets/hero-street-1.jpg';
import heroStreet2 from './assets/hero-street-2.jpg';
import heroStreetwear from './assets/hero-streetwear.jpg';
import productShowcase from './assets/product-showcase.jpg';
import heroSection1 from './assets/hero-section-1.jpg';
import heroSection2 from './assets/hero-section-2.jpg';
import LatestDrops from "./pages/LatestDrops";
import Archiv from "./pages/Archiv";
import GiftCards from "./pages/GiftCards";

const queryClient = new QueryClient();

function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!showSplash) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full animate-gradient-move bg-gradient-to-br from-[#18181b] via-[#232526] to-[#ff914d]/80 opacity-90 backdrop-blur-2xl" />
      {/* Animated diagonal lines overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 40px)',
        opacity: 0.5
      }} />
      {/* Logo */}
      <img 
        src="/logo.jpeg" 
        alt="Mo's VintageWorld Logo" 
        className="w-40 h-40 z-10 animate-fade-in shadow-2xl object-contain"
        style={{
          filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.20))',
          background: 'rgba(255,255,255,0.10)',
          borderRadius: '0.75rem'
        }}
      />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SplashScreen />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
              <Route path="latest-drops" element={<LatestDrops />} />
              <Route path="archive" element={<Archiv />} />
              <Route path="gift-cards" element={<GiftCards />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
