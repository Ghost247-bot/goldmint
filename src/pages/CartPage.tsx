import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      return;
    }
    navigate('/checkout');
  };
  
  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-elegant p-8 text-center">
            <ShoppingBag size={48} className="text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-medium mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-medium text-charcoal-dark">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            Review your items and proceed to checkout.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">Your Items ({items.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove All
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.product.id} className="p-6 flex flex-col md:flex-row items-start">
                    {/* Product image */}
                    <div className="w-full md:w-1/4 mb-4 md:mb-0">
                      <Link to={`/products/${item.product.slug}`} className="block">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-auto rounded-md"
                        />
                      </Link>
                    </div>
                    
                    {/* Product details */}
                    <div className="w-full md:w-3/4 md:pl-6 flex flex-col md:flex-row">
                      <div className="flex-1">
                        <Link 
                          to={`/products/${item.product.slug}`} 
                          className="text-lg font-medium text-charcoal-dark hover:text-gold transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 mb-2">
                          {item.product.weight}{item.product.weightUnit} | {item.product.purity} Fine Gold
                        </p>
                        
                        {/* Quantity control for mobile */}
                        <div className="flex items-center justify-between md:hidden mt-2 mb-4">
                          <div className="flex items-center">
                            <select
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                              className="border border-gray-200 rounded-md p-1 text-sm text-charcoal"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span className="font-semibold">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center text-sm space-x-4">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Remove
                          </button>
                          <Link to={`/products/${item.product.slug}`} className="text-blue-500 hover:text-blue-700 transition-colors">
                            View Details
                          </Link>
                        </div>
                      </div>
                      
                      {/* Quantity and price - desktop */}
                      <div className="hidden md:flex flex-col items-end justify-between h-full mt-4 md:mt-0">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                          className="border border-gray-200 rounded-md p-1 text-sm text-charcoal"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>
                              Qty: {num}
                            </option>
                          ))}
                        </select>
                        <span className="font-semibold text-lg mt-2">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t border-gray-100">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-charcoal hover:text-gold transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-elegant p-6 sticky top-24">
              <h2 className="text-xl font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              
              <button 
                className="btn btn-primary w-full mb-4 flex justify-center items-center"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                <CreditCard size={18} className="mr-2" />
                Proceed to Checkout
              </button>
              
              <div className="space-y-3 mt-6">
                <div className="flex items-start">
                  <Shield className="text-gold flex-shrink-0 mr-2 mt-1" size={16} />
                  <span className="text-xs text-gray-600">
                    Secure checkout with encrypted payment processing
                  </span>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="text-gold flex-shrink-0 mr-2 mt-1" size={16} />
                  <span className="text-xs text-gray-600">
                    30-day return policy for unused, sealed products
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;