import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, User, MapPin, Truck, Shield, ArrowLeft, Copy } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Billing Information
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: '',
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom mx-auto">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-elegant p-8 text-center">
            <h1 className="text-2xl font-medium mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">
              Please add items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSameAsShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAsShipping(e.target.checked);
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingState: prev.state,
        billingZipCode: prev.zipCode,
        billingCountry: prev.country
      }));
    }
  };

  const validateCardNumber = (number: string) => {
    // Remove spaces and dashes
    const cleanNumber = number.replace(/[\s-]/g, '');
    // Check if it's a valid credit card number (Luhn algorithm)
    let sum = 0;
    let isEven = false;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiryDate = (date: string) => {
    // Check format first (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date)) {
      return false;
    }

    const [month, year] = date.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    // Check if the date is in the past
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }

    // Check if the date is too far in the future (e.g., 10 years)
    const maxYear = (currentYear + 10) % 100;
    if (expYear > maxYear) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (currentStep === 3) {
      // Validate payment information
      if (!validateCardNumber(formData.cardNumber)) {
        setError('Please enter a valid card number');
        return;
      }
      if (!validateExpiryDate(formData.expiryDate)) {
        setError('Please enter a valid expiry date (MM/YY). The date cannot be in the past or more than 10 years in the future.');
        return;
      }
      if (formData.cvv.length < 3 || formData.cvv.length > 4) {
        setError('Please enter a valid CVV');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        setIsSubmitting(true);
        
        // Generate a UUID for the order ID
        const orderId = crypto.randomUUID();
        
        // Calculate estimated delivery date (5-7 business days)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5 + Math.floor(Math.random() * 3));

        // Prepare order details
        const orderDetails = {
          orderId,
          items,
          total,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            email: formData.email,
            phone: formData.phone
          },
          billingAddress: {
            firstName: sameAsShipping ? formData.firstName : formData.billingFirstName,
            lastName: sameAsShipping ? formData.lastName : formData.billingLastName,
            address: sameAsShipping ? formData.address : formData.billingAddress,
            city: sameAsShipping ? formData.city : formData.billingCity,
            state: sameAsShipping ? formData.state : formData.billingState,
            zipCode: sameAsShipping ? formData.zipCode : formData.billingZipCode,
            country: sameAsShipping ? formData.country : formData.billingCountry
          },
          paymentMethod: {
            type: 'Credit Card',
            last4: formData.cardNumber.slice(-4)
          },
          orderDate: new Date().toISOString(),
          estimatedDelivery: deliveryDate.toISOString()
        };

        // Save order to database if user is logged in
        if (user) {
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
              id: orderId,
              user_id: user.id,
              total_amount: total,
              status: 'pending',
              shipping_address: orderDetails.shippingAddress,
              billing_address: orderDetails.billingAddress.address,
              billing_city: orderDetails.billingAddress.city,
              billing_state: orderDetails.billingAddress.state,
              billing_zip: orderDetails.billingAddress.zipCode,
              billing_country: orderDetails.billingAddress.country,
              billing_first_name: orderDetails.billingAddress.firstName,
              billing_last_name: orderDetails.billingAddress.lastName,
              payment_method: `${orderDetails.paymentMethod.type} ending in ${orderDetails.paymentMethod.last4}`,
              created_at: orderDetails.orderDate,
              estimated_delivery: orderDetails.estimatedDelivery
            })
            .select()
            .single();
            
          if (orderError) {
            console.error('Order error:', orderError);
            throw new Error('Failed to save order details. Please try again.');
          }
          
          // Save order items
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(items.map(item => ({
              order_id: orderId,
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price
            })));
            
          if (itemsError) {
            console.error('Items error:', itemsError);
            throw new Error('Failed to save order items. Please try again.');
          }
        }

        // Clear cart only after successful order submission
        clearCart();

        // Show success message
        alert('Order placed successfully! Redirecting to order confirmation...');

        // Navigate to order confirmation page with order details
        navigate('/order-confirmation', { state: { orderDetails } });
      } catch (error) {
        console.error('Error saving order:', error);
        setError(error instanceof Error ? error.message : 'There was an error processing your order. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3, 4].map(step => (
        <div
          key={step}
          className={`flex items-center ${
            step < currentStep ? 'text-gold' : step === currentStep ? 'text-charcoal' : 'text-gray-400'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
              step <= currentStep ? 'border-gold' : 'border-gray-300'
            }`}
          >
            {step}
          </div>
          <span className="ml-2 text-sm font-medium">
            {step === 1 ? 'Shipping' : step === 2 ? 'Billing' : step === 3 ? 'Payment' : 'Review'}
          </span>
          {step < 4 && (
            <div className={`w-16 h-0.5 mx-4 ${step < currentStep ? 'bg-gold' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderShippingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Continue to Billing
        </button>
      </div>
    </form>
  );

  const renderBillingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id="sameAsShipping"
          checked={sameAsShipping}
          onChange={handleSameAsShippingChange}
          className="h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
        />
        <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-600">
          Billing address is the same as shipping address
        </label>
      </div>

      {!sameAsShipping && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="billingFirstName"
                value={formData.billingFirstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="billingLastName"
                value={formData.billingLastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="billingCity"
                value={formData.billingCity}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="billingState"
                value={formData.billingState}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                name="billingZipCode"
                value={formData.billingZipCode}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              name="billingCountry"
              value={formData.billingCountry}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
            />
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">
          Continue to Payment
        </button>
      </div>
    </form>
  );

  const renderPaymentForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleInputChange}
          required
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          pattern="[0-9\s-]+"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
        <p className="mt-1 text-sm text-gray-500">
          We accept Visa, Mastercard, American Express, and Discover
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            required
            placeholder="MM/YY"
            maxLength={5}
            pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
          <p className="mt-1 text-sm text-gray-500">
            Format: MM/YY (e.g., 12/25)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            required
            placeholder="123"
            maxLength={4}
            pattern="[0-9]*"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
          />
          <p className="mt-1 text-sm text-gray-500">
            3 or 4 digits on the back of your card
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="text-gold flex-shrink-0 mr-2 mt-1" size={16} />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Secure Payment</p>
            <p>Your payment information is encrypted and secure. We never store your full card details.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="btn btn-outline"
        >
          Back to Shipping
        </button>
        <button type="submit" className="btn btn-primary">
          Review Order
        </button>
      </div>
    </form>
  );

  const renderOrderReview = () => (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-elegant p-6">
        <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
        <div className="space-y-2 text-sm">
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}</p>
          <p>{formData.city}, {formData.state} {formData.zipCode}</p>
          <p>{formData.country}</p>
          <p>{formData.email}</p>
          <p>{formData.phone}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-elegant p-6">
        <h3 className="text-lg font-medium mb-4">Billing Information</h3>
        <div className="space-y-2 text-sm">
          <p>
            {sameAsShipping ? formData.firstName : formData.billingFirstName}{' '}
            {sameAsShipping ? formData.lastName : formData.billingLastName}
          </p>
          <p>{sameAsShipping ? formData.address : formData.billingAddress}</p>
          <p>
            {sameAsShipping ? formData.city : formData.billingCity},{' '}
            {sameAsShipping ? formData.state : formData.billingState}{' '}
            {sameAsShipping ? formData.zipCode : formData.billingZipCode}
          </p>
          <p>{sameAsShipping ? formData.country : formData.billingCountry}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-elegant p-6">
        <h3 className="text-lg font-medium mb-4">Payment Information</h3>
        <div className="space-y-2 text-sm">
          <p>Card ending in {formData.cardNumber.slice(-4)}</p>
          <p>Expires: {formData.expiryDate}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-elegant p-6">
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
        <div className="space-y-4">
          {items.map(item => (
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
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="btn btn-outline"
          disabled={isSubmitting}
        >
          Back to Payment
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        <button
          onClick={() => navigate('/cart')}
          className="mb-6 flex items-center text-charcoal hover:text-gold transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Cart
        </button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-serif font-medium text-charcoal-dark mb-8">
            Checkout
          </h1>

          {renderStepIndicator()}

          <div className="bg-white rounded-lg shadow-elegant p-6">
            {currentStep === 1 && renderShippingForm()}
            {currentStep === 2 && renderBillingForm()}
            {currentStep === 3 && renderPaymentForm()}
            {currentStep === 4 && renderOrderReview()}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-start">
              <Shield className="text-gold flex-shrink-0 mr-2 mt-1" size={16} />
              <span className="text-sm text-gray-600">
                Your payment information is encrypted and secure
              </span>
            </div>
            <div className="flex items-start">
              <Truck className="text-gold flex-shrink-0 mr-2 mt-1" size={16} />
              <span className="text-sm text-gray-600">
                Free shipping on orders over $1,000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 