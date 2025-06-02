import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AccountPage from './pages/AccountPage';
import NotFoundPage from './pages/NotFoundPage';
import GoldPricesPage from './pages/GoldPricesPage';
import AboutPage from './pages/AboutPage';
import SearchPage from './pages/SearchPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import TrackOrderPage from './pages/TrackOrderPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import ScrollToTop from './components/utils/ScrollToTop';
import AdminRoute from './components/utils/AdminRoute';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import './i18n';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products/:slug" element={<ProductPage />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/account/*" element={<AccountPage />} />
                  <Route path="/gold-prices" element={<GoldPricesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/news/:id" element={<NewsDetailPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/track-order" element={<TrackOrderPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;