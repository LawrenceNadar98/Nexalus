import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { StoreProvider } from "./contexts/StoreContext";

// Main Website Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import SolutionsSection from "./components/SolutionsSection";
import BenefitsSection from "./components/BenefitsSection";
import GallerySection from "./components/GallerySection";
import PartnersSection from "./components/PartnersSection";
import WhyChooseUsSection from "./components/WhyChooseUsSection";
import IndustriesSection from "./components/IndustriesSection";
import ContactSection from "./components/ContactSection";

// Store Components
import StoreHeader from "./components/store/StoreHeader";
import ProductListing from "./pages/store/ProductListing";
import ProductDetail from "./pages/store/ProductDetail";
import Login from "./pages/store/Login";
import Register from "./pages/store/Register";
import Cart from "./pages/store/Cart";
import Checkout from "./pages/store/Checkout";
import OrderConfirmation from "./pages/store/OrderConfirmation";
import Orders from "./pages/store/Orders";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Main Website Layout
const MainWebsite = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <SolutionsSection />
        <BenefitsSection />
        <GallerySection />
        <PartnersSection />
        <WhyChooseUsSection />
        <IndustriesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

// Store Layout
const StoreLayout = ({ children }) => {
  return (
    <>
      <StoreHeader />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <div className="App">
          <Toaster position="top-right" richColors />
          <Routes>
            {/* Main Website */}
            <Route path="/" element={<MainWebsite />} />
            
            {/* Store Routes */}
            <Route path="/store" element={<StoreLayout><ProductListing /></StoreLayout>} />
            <Route path="/store/products" element={<StoreLayout><ProductListing /></StoreLayout>} />
            <Route path="/store/product/:productId" element={<StoreLayout><ProductDetail /></StoreLayout>} />
            <Route path="/store/login" element={<Login />} />
            <Route path="/store/register" element={<Register />} />
            <Route path="/store/cart" element={<StoreLayout><Cart /></StoreLayout>} />
            <Route path="/store/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
            <Route path="/store/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/store/orders" element={<StoreLayout><Orders /></StoreLayout>} />
            <Route path="/store/order/:orderId" element={<StoreLayout><Orders /></StoreLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Placeholder for other store routes */}
            <Route path="/store/*" element={
              <StoreLayout>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Coming Soon</h1>
                    <p className="text-gray-600">This page is under construction</p>
                    <button 
                      onClick={() => window.location.href = '/store'}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Back to Store
                    </button>
                  </div>
                </div>
              </StoreLayout>
            } />
          </Routes>
        </div>
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
