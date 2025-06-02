import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Download, Mail, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface OrderDetails {
  orderId: string;
  items: any[];
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
  };
  orderDate: string;
  estimatedDelivery: string;
}

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [hasClearedCart, setHasClearedCart] = useState(false);

  useEffect(() => {
    // In a real application, you would fetch the order details from your backend
    // For now, we'll use the data passed through navigation state
    if (location.state?.orderDetails) {
      setOrderDetails(location.state.orderDetails);
      // Clear cart only once
      if (!hasClearedCart) {
        clearCart();
        setHasClearedCart(true);
      }
    } else {
      // If no order details are found, redirect to home
      navigate('/');
    }
  }, [location.state, navigate, clearCart, hasClearedCart]);

  if (!orderDetails) {
    return null;
  }

  const handleDownloadReceipt = () => {
    // TODO: Implement receipt download functionality
    console.log('Downloading receipt...');
  };

  const handleEmailReceipt = () => {
    // TODO: Implement email receipt functionality
    console.log('Sending receipt via email...');
  };

  const handleTrackOrder = () => {
    if (orderDetails) {
      navigate('/track-order', { state: { orderId: orderDetails.orderId } });
    }
  };

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-elegant p-8 text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-medium text-charcoal-dark mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been received.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-lg font-medium text-charcoal-dark">{orderDetails.orderId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-elegant p-6">
              <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
              <div className="space-y-2 text-sm">
                <p>{orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                <p>{orderDetails.shippingAddress.address}</p>
                <p>{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}</p>
                <p>{orderDetails.shippingAddress.country}</p>
                <p>{orderDetails.shippingAddress.email}</p>
                <p>{orderDetails.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow-elegant p-6">
              <h2 className="text-lg font-medium mb-4">Billing Information</h2>
              <div className="space-y-2 text-sm">
                <p>{orderDetails.billingAddress.firstName} {orderDetails.billingAddress.lastName}</p>
                <p>{orderDetails.billingAddress.address}</p>
                <p>{orderDetails.billingAddress.city}, {orderDetails.billingAddress.state} {orderDetails.billingAddress.zipCode}</p>
                <p>{orderDetails.billingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-elegant p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-4">
              {orderDetails.items.map((item: any) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${orderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-elegant p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(orderDetails.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium">{new Date(orderDetails.estimatedDelivery).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">
                  {orderDetails.paymentMethod.type} ending in {orderDetails.paymentMethod.last4}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTrackOrder}
              className="btn btn-primary flex items-center justify-center"
            >
              <Package size={18} className="mr-2" />
              Track Order
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="btn btn-outline flex items-center justify-center"
            >
              <Download size={18} className="mr-2" />
              Download Receipt
            </button>
            <button
              onClick={handleEmailReceipt}
              className="btn btn-outline flex items-center justify-center"
            >
              <Mail size={18} className="mr-2" />
              Email Receipt
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 