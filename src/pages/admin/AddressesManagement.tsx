import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
  created_at: string;
  profile: {
    name: string;
    email: string;
  };
}

const AddressesManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select(`
          *,
          profile:profiles!addresses_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAddress) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zip: formData.get('zip'),
        country: formData.get('country'),
        is_default: formData.get('is_default') === 'true'
      };

      const { error } = await supabase
        .from('addresses')
        .update(updates)
        .eq('id', editingAddress.id);

      if (error) throw error;

      await fetchAddresses();
      setShowEditModal(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Error updating address:', err);
      alert('Failed to update address');
    }
  };

  const filteredAddresses = addresses.filter(address =>
    address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.profile?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.profile?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    address.city.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-xl font-medium">Addresses Management</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search addresses..."
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
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Address</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Contact</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Default</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created At</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAddresses.map((address) => (
                <tr key={address.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="font-medium">{address.profile?.name}</div>
                    <div className="text-sm text-gray-500">{address.profile?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{address.street}</div>
                    <div className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.zip}
                    </div>
                    <div className="text-sm text-gray-500">{address.country}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{address.name}</div>
                    <div className="text-sm text-gray-500">{address.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      address.is_default ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {address.is_default ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(address.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAddresses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No addresses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Address Modal */}
      {showEditModal && editingAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Edit Address</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingAddress.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingAddress.phone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  defaultValue={editingAddress.street}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={editingAddress.city}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    defaultValue={editingAddress.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    defaultValue={editingAddress.zip}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={editingAddress.country}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_default"
                    defaultChecked={editingAddress.is_default}
                    value="true"
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set as default address</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingAddress(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesManagement;