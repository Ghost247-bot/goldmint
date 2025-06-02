import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Package, Truck, CheckCircle, Clock, AlertTriangle, 
  MapPin, Calendar, Box, ArrowRight, ShoppingBag, Phone, Mail 
} from 'lucide-react';

interface OrderStatus {
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  location?: string;
  description: string;
}

interface TrackingResult {
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  status: OrderStatus[];
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  carrier: {
    name: string;
    trackingNumber: string;
    phone: string;
    email: string;
  };
}

const mockTrackingResult: TrackingResult = {
  orderId: 'ORD-123456',
  orderDate: '2025-05-01',
  estimatedDelivery: '2025-05-05',
  status: [
    {
      status: 'delivered',
      date: '2025-05-04 14:30',
      location: 'New York, NY',
      description: 'Package delivered to recipient'
    },
    {
      status: 'shipped',
      date: '2025-05-03 09:15',
      location: 'Newark, NJ',
      description: 'Out for delivery'
    },
    {
      status: 'shipped',
      date: '2025-05-02 18:45',
      location: 'Philadelphia, PA',
      description: 'Arrived at regional facility'
    },
    {
      status: 'processing',
      date: '2025-05-01 10:00',
      location: 'Miami, FL',
      description: 'Order processed and ready for shipment'
    }
  ],
  items: [
    {
      name: '1oz Gold Bar',
      quantity: 1,
      price: 2150.00,
      image: 'https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg'
    }
  ],
  shippingAddress: {
    name: 'John Doe',
    address: '123 Gold Avenue, Suite 100',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  carrier: {
    name: 'Secure Express',
    trackingNumber: 'SEC123456789',
    phone: '1-800-123-4567',
    email: 'support@secureexpress.com'
  }
};

const TrackOrderPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState<TrackingResult | 'not-found' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (orderId.toUpperCase() === 'ORD-123456' && email.toLowerCase() === 'demo@example.com') {
      setSearchResult(mockTrackingResult);
    } else {
      setSearchResult('not-found');
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: OrderStatus['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500';
      case 'shipped':
        return 'text-blue-500';
      case 'processing':
        return 'text-yellow-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: OrderStatus['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6" />;
      case 'shipped':
        return <Truck className="w-6 h-6" />;
      case 'processing':
        return <Clock className="w-6 h-6" />;
      case 'cancelled':
        return <AlertTriangle className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-medium text-charcoal-dark mb-2">
              Track Your Order
            </h1>
            <p className="text-gray-600">
              Enter your order details below to track your purchase
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-elegant overflow-hidden mb-8">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                      Order Number
                    </label>
                    <input
                      id="orderId"
                      type="text"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g., ORD-123456"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-full mt-6 flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Searching...'
                  ) : (
                    <>
                      <Search size={18} className="mr-2" />
                      Track Order
                    </>
                  )}
                </button>
              </form>

              {searchResult === 'not-found' && (
                <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-md max-w-2xl mx-auto">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium">Order Not Found</h3>
                      <p className="mt-1 text-sm">
                        We couldn't find an order matching these details. Please check your information and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {searchResult && searchResult !== 'not-found' && (
            <div className="space-y-8">
              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-medium">Order Status</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Order #{searchResult.orderId} • Placed on {new Date(searchResult.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">{new Date(searchResult.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="relative">
                    {searchResult.status.map((status, index) => (
                      <div key={index} className="flex mb-8 last:mb-0">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(status.status)}`}>
                          {getStatusIcon(status.status)}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-baseline">
                            <h3 className="font-medium">
                              {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                            </h3>
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(status.date).toLocaleString()}
                            </span>
                          </div>
                          {status.location && (
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                              <MapPin size={14} className="mr-1" />
                              {status.location}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            {status.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-medium">Shipping Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Delivery Address</h3>
                        <p className="mt-1">
                          {searchResult.shippingAddress.name}<br />
                          {searchResult.shippingAddress.address}<br />
                          {searchResult.shippingAddress.city}, {searchResult.shippingAddress.state} {searchResult.shippingAddress.zip}<br />
                          {searchResult.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Carrier Details</h3>
                        <p className="mt-1">
                          {searchResult.carrier.name}<br />
                          Tracking #: {searchResult.carrier.trackingNumber}
                        </p>
                        <div className="mt-2 space-y-2">
                          <a 
                            href={`tel:${searchResult.carrier.phone}`}
                            className="text-gold hover:text-gold-dark transition-colors flex items-center"
                          >
                            <Phone size={16} className="mr-1" />
                            {searchResult.carrier.phone}
                          </a>
                          <a 
                            href={`mailto:${searchResult.carrier.email}`}
                            className="text-gold hover:text-gold-dark transition-colors flex items-center"
                          >
                            <Mail size={16} className="mr-1" />
                            {searchResult.carrier.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-medium">Order Summary</h2>
                  </div>
                  <div className="p-6">
                    {searchResult.items.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm font-medium mt-1">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">
                          ${searchResult.items.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Have an account? Track all your orders in your account dashboard.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/account/login" className="btn btn-primary">
                Sign In
              </Link>
              <Link to="/account/register" className="btn btn-outline">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;