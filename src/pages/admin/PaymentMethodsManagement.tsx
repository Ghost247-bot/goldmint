import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Plus, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PaymentMethod {
  id: string;
  user_id: string;
  card_last4: string;
  card_brand: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  created_at: string;
  profile: {
    name: string;
    email: string;
  };
}

const PaymentMethodsManagement: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select(`
          *,
          profile:profiles!payment_methods_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError('Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this payment method?')) return;

    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPaymentMethods(methods => methods.filter(method => method.id !== id));
    } catch (err) {
      console.error('Error deleting payment method:', err);
      alert('Failed to delete payment method');
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMethod) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        card_brand: formData.get('card_brand'),
        card_last4: formData.get('card_last4'),
        exp_month: parseInt(formData.get('exp_month') as string),
        exp_year: parseInt(formData.get('exp_year') as string),
        is_default: formData.get('is_default') === 'true'
      };

      const { error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', editingMethod.id);

      if (error) throw error;

      await fetchPaymentMethods();
      setShowEditModal(false);
      setEditingMethod(null);
    } catch (err) {
      console.error('Error updating payment method:', err);
      alert('Failed to update payment method');
    }
  };

  const filteredMethods = paymentMethods.filter(method =>
    method.profile?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.profile?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.card_brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.card_last4.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-medium">Payment Methods Management</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search payment methods..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 m-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </p>
        </div>
      )}

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Card Details</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Expiry</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Default</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created At</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMethods.map((method) => (
                <tr key={method.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="font-medium">{method.profile?.name}</div>
                    <div className="text-sm text-gray-500">{method.profile?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <CreditCard size={20} className="text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium capitalize">{method.card_brand}</div>
                        <div className="text-sm text-gray-500">•••• {method.card_last4}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {method.exp_month.toString().padStart(2, '0')}/{method.exp_year}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      method.is_default ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.is_default ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(method.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMethods.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No payment methods found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Method Modal */}
      {showEditModal && editingMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Edit Payment Method</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Brand
                </label>
                <select
                  name="card_brand"
                  defaultValue={editingMethod.card_brand}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="discover">Discover</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  name="card_last4"
                  defaultValue={editingMethod.card_last4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Month
                  </label>
                  <select
                    name="exp_month"
                    defaultValue={editingMethod.exp_month}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Year
                  </label>
                  <select
                    name="exp_year"
                    defaultValue={editingMethod.exp_year}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_default"
                    defaultChecked={editingMethod.is_default}
                    value="true"
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set as default payment method</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMethod(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsManagement;