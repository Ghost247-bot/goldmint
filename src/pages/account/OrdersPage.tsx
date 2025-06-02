import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Check, AlertTriangle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface OrderItem {
  id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  order_items: OrderItem[];
}

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products (*)
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <Check size={14} className="mr-1" />;
      case 'processing':
        return <Clock size={14} className="mr-1" />;
      case 'cancelled':
        return <AlertTriangle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-medium">My Orders</h2>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <span className="text-sm text-gray-500">Order #:</span>
                    <span className="font-medium ml-1">{order.id}</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center mt-2 md:mt-0 gap-2 md:gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="ml-1">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Total:</span>
                      <span className="font-medium ml-1">
                        ${Number(order.total_amount).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`ml-1 inline-flex items-center ${
                        order.status === 'delivered' 
                          ? 'text-green-600' 
                          : order.status === 'processing' 
                            ? 'text-blue-600' 
                            : 'text-red-600'
                      }`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Link 
                      to={`/account/orders/${order.id}`} 
                      className="text-gold hover:text-gold-dark transition-colors flex items-center text-sm"
                    >
                      View Order Details
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;