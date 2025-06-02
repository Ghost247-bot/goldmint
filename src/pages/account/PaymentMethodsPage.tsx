import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface PaymentMethod {
  id: string;
  card_last4: string;
  card_brand: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

const PaymentMethodsPage: React.FC = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user?.id)
          .order('is_default', { ascending: false });

        if (error) throw error;
        setPaymentMethods(data || []);
      } catch (err) {
        console.error('Error fetching payment methods:', err);
        setError('Failed to load payment methods');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleAddPaymentMethod = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const newPaymentMethod = {
        user_id: user?.id,
        card_last4: formData.get('cardNumber')?.toString().slice(-4) || '',
        card_brand: 'visa', // In a real app, this would be determined by the card number
        exp_month: parseInt(formData.get('expiry')?.toString().split('/')[0] || '0'),
        exp_year: parseInt('20' + (formData.get('expiry')?.toString().split('/')[1] || '0')),
        is_default: paymentMethods.length === 0
      };

      const { error } = await supabase
        .from('payment_methods')
        .insert(newPaymentMethod);

      if (error) throw error;

      // Refresh payment methods
      const { data, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (fetchError) throw fetchError;
      setPaymentMethods(data || []);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError('Failed to add payment method');
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    } catch (err) {
      console.error('Error deleting payment method:', err);
      setError('Failed to delete payment method');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Loading payment methods...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-medium">Payment Methods</h2>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary mb-6 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add Payment Method
        </button>
        
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Add New Card</h3>
            <form onSubmit={handleAddPaymentMethod} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    className="form-input"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    className="form-input"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Card
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No payment methods added yet
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="text-gray-400 mr-4" size={24} />
                  <div>
                    <p className="font-medium">•••• •••• •••• {method.card_last4}</p>
                    <p className="text-sm text-gray-500">
                      Expires {method.exp_month.toString().padStart(2, '0')}/{method.exp_year.toString().slice(-2)}
                      {method.is_default && (
                        <span className="ml-2 text-gold">Default</span>
                      )}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeletePaymentMethod(method.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;