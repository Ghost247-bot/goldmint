import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, ShoppingBag, Heart, CreditCard, Settings, Shield,
  LogOut, ChevronRight, Menu, X, MapPin, TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LoginPage from './account/LoginPage';
import RegisterPage from './account/RegisterPage';
import DashboardPage from './account/DashboardPage';
import ProfilePage from './account/ProfilePage';
import OrdersPage from './account/OrdersPage';
import WishlistPage from './account/WishlistPage';
import PaymentMethodsPage from './account/PaymentMethodsPage';
import SecurityPage from './account/SecurityPage';
import AddressesPage from './account/AddressesPage';
import InvestmentPage from './account/InvestmentPage';
import InvestmentDetailsPage from './account/InvestmentDetailsPage';

const AccountPage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!isAuthenticated && !location.pathname.includes('login') && !location.pathname.includes('register')) {
      navigate('/account/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  if (!isAuthenticated) {
    if (location.pathname.includes('login')) {
      return <LoginPage />;
    }
    if (location.pathname.includes('register')) {
      return <RegisterPage />;
    }
    return null;
  }
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const menuItems = [
    { path: '/account', label: t('account.menu.dashboard'), icon: <User size={18} /> },
    { path: '/account/profile', label: t('account.menu.profile'), icon: <User size={18} /> },
    { path: '/account/investments', label: t('account.menu.investments'), icon: <TrendingUp size={18} /> },
    { path: '/account/orders', label: t('account.menu.orders'), icon: <ShoppingBag size={18} /> },
    { path: '/account/wishlist', label: t('account.menu.wishlist'), icon: <Heart size={18} /> },
    { path: '/account/payment', label: t('account.menu.payment'), icon: <CreditCard size={18} /> },
    { path: '/account/addresses', label: t('account.menu.addresses'), icon: <MapPin size={18} /> },
    { path: '/account/security', label: t('account.menu.security'), icon: <Shield size={18} /> },
    { path: '/account/settings', label: t('account.menu.settings'), icon: <Settings size={18} /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden flex justify-between items-center bg-white rounded-lg shadow-elegant p-4 mb-4">
            <h1 className="text-xl font-medium">{t('account.title')}</h1>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          {/* Sidebar */}
          <div className={`md:w-1/4 md:block ${sidebarOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-elegant overflow-hidden sticky top-24">
              {/* User info */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center text-gold font-medium text-xl">
                    {user?.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-sm text-gray-500">Member since {user?.created_at ? new Date(user.created_at).getFullYear() : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                          isActive(item.path)
                            ? 'bg-gold-light text-gold'
                            : 'text-charcoal hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                        {isActive(item.path) && (
                          <ChevronRight size={16} className="ml-auto" />
                        )}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} className="mr-3" />
                      <span>{t('account.menu.logout')}</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/investments" element={<InvestmentPage />} />
              <Route path="/investments/:investmentId" element={<InvestmentDetailsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/payment" element={<PaymentMethodsPage />} />
              <Route path="/addresses" element={<AddressesPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/settings" element={<ComingSoon title={t('account.menu.settings')} />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComingSoon: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-white rounded-lg shadow-elegant p-8 text-center">
      <h2 className="text-2xl font-medium mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">
        This feature is coming soon. We're working hard to make it available.
      </p>
    </div>
  );
};

export default AccountPage;