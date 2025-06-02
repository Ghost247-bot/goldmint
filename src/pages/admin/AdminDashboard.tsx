import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  Shield,
  Settings,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { supabase } from '../../lib/supabase';

// Import management components
import ProductsManagement from './ProductsManagement';
import UsersManagement from './UsersManagement';
import OrdersManagement from './OrdersManagement';
import InvestmentsManagement from './InvestmentsManagement';
import AddressesManagement from './AddressesManagement';
import PaymentMethodsManagement from './PaymentMethodsManagement';
import SecurityManagement from './SecurityManagement';
import SettingsManagement from './SettingsManagement';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeInvestments: number;
}

const DashboardContent: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
        <p className="text-2xl font-bold">{stats.totalUsers}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
        <p className="text-2xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
        <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-gray-500 text-sm font-medium">Active Investments</h3>
        <p className="text-2xl font-bold">{stats.activeInvestments}</p>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeInvestments: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch orders and calculate revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount');

        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

        // Fetch active investments
        const { count: investmentsCount } = await supabase
          .from('investments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: orders?.length || 0,
          totalRevenue,
          activeInvestments: investmentsCount || 0
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/products', label: 'Products', icon: <Package size={18} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { path: '/admin/investments', label: 'Investments', icon: <DollarSign size={18} /> },
    { path: '/admin/addresses', label: 'Addresses', icon: <Package size={18} /> },
    { path: '/admin/payment-methods', label: 'Payment Methods', icon: <Settings size={18} /> },
    { path: '/admin/security', label: 'Security', icon: <Shield size={18} /> },
    { path: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-100">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white shadow-md transition-transform duration-300 z-20 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome, {admin?.username}</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          <Routes>
            <Route path="/" element={<DashboardContent stats={stats} />} />
            <Route path="/products/*" element={<ProductsManagement />} />
            <Route path="/users/*" element={<UsersManagement />} />
            <Route path="/orders/*" element={<OrdersManagement />} />
            <Route path="/investments/*" element={<InvestmentsManagement />} />
            <Route path="/addresses/*" element={<AddressesManagement />} />
            <Route path="/payment-methods/*" element={<PaymentMethodsManagement />} />
            <Route path="/security/*" element={<SecurityManagement />} />
            <Route path="/settings/*" element={<SettingsManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;