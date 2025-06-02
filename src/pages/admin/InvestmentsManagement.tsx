import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Investment {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  quantity: number;
  purchase_price: number;
  current_value: number;
  status: string;
  created_at: string;
  product: {
    name: string;
    category: string;
  };
  profile: {
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const InvestmentsManagement: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  // Form state
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch investments
      const { data: investmentsData, error: investmentsError } = await supabase
        .from('investments')
        .select(`
          *,
          product:products(name, category),
          profile:profiles(name, email)
        `)
        .order('created_at', { ascending: false });

      if (investmentsError) throw investmentsError;
      setInvestments(investmentsData || []);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .order('name');

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, category')
        .order('name');

      if (productsError) throw productsError;
      setProducts(productsData || []);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvestment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this investment?')) return;

    try {
      const { data, error, count, status } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      console.log({ data, error, count, status });

      if (error) {
        if (error.code === '42501') {
          throw new Error('You do not have permission to delete investments. Please contact your administrator.');
        } else {
          throw error;
        }
      }
      
      setInvestments(investments.filter(inv => inv.id !== id));
      alert('Investment deleted successfully');
    } catch (err: any) {
      console.error('Error deleting investment:', err);
      alert(err.message || 'Failed to delete investment. Please try again.');
    }
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setSelectedUser(investment.user_id);
    setSelectedProduct(investment.product_id);
    setQuantity(investment.quantity.toString());
    setPurchasePrice(investment.purchase_price.toString());
    setCurrentValue(investment.current_value.toString());
    setStatus(investment.status);
    setShowEditModal(true);
  };

  const handleUpdateInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingInvestment) return;

    try {
      const updates = {
        quantity: parseFloat(quantity),
        purchase_price: parseFloat(purchasePrice),
        current_value: parseFloat(currentValue),
        amount: parseFloat(purchasePrice) * parseFloat(quantity),
        status
      };

      const { error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', editingInvestment.id);

      if (error) throw error;

      // Refresh investments
      await fetchData();
      setShowEditModal(false);
      resetForm();

    } catch (err: any) {
      console.error('Error updating investment:', err);
      alert(err.message || 'Failed to update investment');
    }
  };

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!selectedUser || !selectedProduct || !quantity || !purchasePrice) {
        throw new Error('Please fill in all required fields');
      }

      const newInvestment = {
        user_id: selectedUser,
        product_id: selectedProduct,
        quantity: parseFloat(quantity),
        purchase_price: parseFloat(purchasePrice),
        current_value: parseFloat(purchasePrice) * parseFloat(quantity),
        amount: parseFloat(purchasePrice) * parseFloat(quantity),
        status: 'active'
      };

      const { error } = await supabase
        .from('investments')
        .insert([newInvestment]);

      if (error) throw error;

      await fetchData();
      setShowAddModal(false);
      resetForm();

    } catch (err: any) {
      console.error('Error adding investment:', err);
      alert(err.message || 'Failed to add investment');
    }
  };

  const resetForm = () => {
    setSelectedUser('');
    setSelectedProduct('');
    setQuantity('');
    setPurchasePrice('');
    setCurrentValue('');
    setStatus('active');
    setEditingInvestment(null);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setInvestments(investments.map(inv => 
        inv.id === id ? { ...inv, status: newStatus } : inv
      ));
    } catch (err) {
      console.error('Error updating investment status:', err);
      alert('Failed to update investment status');
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = 
      investment.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || investment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-medium">Investment Management</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search investments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="pending">Pending</option>
            </select>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Investment
            </button>
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvestments.map((investment) => (
              <tr key={investment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {investment.profile?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">{investment.profile?.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{investment.product.name}</div>
                  <div className="text-sm text-gray-500">{investment.product.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${investment.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{investment.quantity} units</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${investment.current_value.toLocaleString()}</div>
                  <div className="text-sm text-green-600">
                    +${(investment.current_value - investment.amount).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={investment.status}
                    onChange={(e) => handleUpdateStatus(investment.id, e.target.value)}
                    className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0
                      ${investment.status === 'active' ? 'bg-green-100 text-green-800' :
                        investment.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}
                  >
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleEditInvestment(investment)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteInvestment(investment.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Investment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Add New Investment</h3>
            <form onSubmit={handleAddInvestment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    const product = products.find(p => p.id === e.target.value);
                    if (product) {
                      setPurchasePrice(product.price.toString());
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                >
                  <option value="">Select a product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ${product.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  step="0.0001"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price (per unit)
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {quantity && purchasePrice && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Investment Summary</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        ${(parseFloat(quantity) * parseFloat(purchasePrice)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Investment Modal */}
      {showEditModal && editingInvestment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Edit Investment</h3>
            <form onSubmit={handleUpdateInvestment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investor
                </label>
                <p className="text-gray-600">
                  {editingInvestment.profile?.name} ({editingInvestment.profile?.email})
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <p className="text-gray-600">
                  {editingInvestment.product.name} ({editingInvestment.product.category})
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  step="0.0001"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price (per unit)
                </label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Value (per unit)
                </label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {quantity && purchasePrice && currentValue && (
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Investment Summary</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">
                        ${(parseFloat(quantity) * parseFloat(purchasePrice)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Value:</span>
                      <span className="font-medium">
                        ${(parseFloat(quantity) * parseFloat(currentValue)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profit/Loss:</span>
                      <span className={`font-medium ${
                        parseFloat(currentValue) > parseFloat(purchasePrice) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        ${((parseFloat(currentValue) - parseFloat(purchasePrice)) * parseFloat(quantity)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentsManagement;