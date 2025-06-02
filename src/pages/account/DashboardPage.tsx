import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, TrendingUp, Heart, ArrowRight } from 'lucide-react';

interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  recentOrders: any[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch orders with better error handling
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            status,
            total_amount,
            order_items (
              id,
              quantity,
              price,
              product:products (
                id,
                name,
                price
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          throw new Error('Failed to fetch orders data');
        }

        // Fetch investments for the user
        const { data: investments, error: investmentsError } = await supabase
          .from('investments')
          .select(`id, created_at, status, amount`)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (investmentsError) {
          console.error('Error fetching investments:', investmentsError);
          throw new Error('Failed to fetch investments data');
        }

        // Fetch wishlist count
        const { count: wishlistCount, error: wishlistError } = await supabase
          .from('wishlist')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);

        if (wishlistError) {
          console.error('Error fetching wishlist:', wishlistError);
          throw new Error('Failed to fetch wishlist data');
        }

        // Calculate stats from valid orders and investments
        const validOrders = orders || [];
        const validInvestments = investments || [];
        const totalSpent = validOrders.reduce((sum, order) => {
          const amount = Number(order.total_amount) || 0;
          return sum + amount;
        }, 0) + validInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);

        // Merge recent orders and investments, sort by date desc
        const recentOrders = [
          ...validOrders.map(order => ({
            ...order,
            type: 'order',
          })),
          ...validInvestments.map(inv => ({
            ...inv,
            type: 'investment',
          })),
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

        setStats({
          totalOrders: validOrders.length + validInvestments.length,
          totalSpent,
          wishlistCount: wishlistCount || 0,
          recentOrders
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Please log in to view your dashboard</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-medium">Dashboard</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Orders</h3>
                <p className="text-2xl font-semibold">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Spent</h3>
                <p className="text-2xl font-semibold">${stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Heart className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Wishlist Items</h3>
                <p className="text-2xl font-semibold">{stats.wishlistCount}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Orders</h3>
              <Link to="/account/orders" className="text-gold hover:text-gold-dark flex items-center">
                View All
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {stats.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">#{order.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {order.type === 'investment' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-yellow-100 text-yellow-800">
                              Investment
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {order.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          ${order.type === 'investment' ? Number(order.amount).toLocaleString() : Number(order.total_amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gold font-medium cursor-pointer">
                          <Link to={order.type === 'investment' ? `/account/investments/${order.id}` : `/account/orders/${order.id}`}>View Details</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
                No orders yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;