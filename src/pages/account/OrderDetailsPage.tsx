import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Clock, Check, AlertTriangle, ChevronLeft } from 'lucide-react';

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
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email?: string;
    phone?: string;
  };
  billing_first_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  payment_method: string;
}

const OrderDetailsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`*, order_items (*, product:products (*)), shipping_address, billing_first_name, billing_last_name, billing_address, billing_city, billing_state, billing_zip, billing_country, payment_method`)
          .eq('id', orderId)
          .single();
        if (error) throw error;
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

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
        <div className="text-center text-gray-500">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-red-600">{error || 'Order not found'}</div>
        <div className="mt-4 text-center">
          <Link to="/account/orders" className="text-gold flex items-center justify-center">
            <ChevronLeft size={16} className="mr-1" /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-2xl font-medium">Order Details</h2>
        <Link to="/account/orders" className="text-gold flex items-center">
          <ChevronLeft size={16} className="mr-1" /> Back to Orders
        </Link>
      </div>
      <div className="p-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span className="text-sm text-gray-500">Order #:</span>
            <span className="font-medium ml-1">{order.id}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Date:</span>
            <span className="ml-1">{new Date(order.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Total:</span>
            <span className="font-medium ml-1">${Number(order.total_amount).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Status:</span>
            <span className={`ml-1 inline-flex items-center ${
              order.status === 'delivered'
                ? 'text-green-600'
                : order.status === 'processing'
                ? 'text-blue-600'
                : order.status === 'shipped'
                ? 'text-purple-600'
                : 'text-red-600'
            }`}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-lg font-medium mb-2">Order Items</h3>
          <div className="space-y-2 mb-6">
            {order.order_items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <span>{item.quantity}× {item.product.name}</span>
                <span className="font-medium">${(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shipping Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-medium mb-2">Shipping</h3>
              <div className="space-y-1 text-sm">
                <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.email && <p>{order.shipping_address.email}</p>}
                {order.shipping_address.phone && <p>{order.shipping_address.phone}</p>}
              </div>
            </div>
            {/* Billing Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-medium mb-2">Billing</h3>
              <div className="space-y-1 text-sm">
                <p>{order.billing_first_name} {order.billing_last_name}</p>
                <p>{order.billing_address}</p>
                <p>{order.billing_city}, {order.billing_state} {order.billing_zip}</p>
                <p>{order.billing_country}</p>
              </div>
            </div>
            {/* Payment Method */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-medium mb-2">Payment</h3>
              <div className="text-sm">
                <p>{order.payment_method}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage; 