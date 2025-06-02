import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user?.id)
          .order('is_default', { ascending: false });

        if (error) throw error;
        setAddresses(data || []);
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Failed to load addresses');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const addressData = {
      user_id: user?.id,
      name: formData.get('name'),
      phone: formData.get('phone'),
      street: formData.get('street'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      country: formData.get('country'),
      is_default: addresses.length === 0
    };

    try {
      if (editingAddress) {
        const { error } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', editingAddress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('addresses')
          .insert(addressData);

        if (error) throw error;
      }

      // Refresh addresses
      const { data, error: fetchError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (fetchError) throw fetchError;
      setAddresses(data || []);
      setShowAddForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAddresses(addresses.filter(addr => addr.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Loading addresses...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-medium">Shipping Addresses</h2>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={() => {
            setEditingAddress(null);
            setShowAddForm(true);
          }}
          className="btn btn-primary mb-6 flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Address
        </button>
        
        {showAddForm && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingAddress?.name}
                    className="form-input"
                    placeholder="John Doe"
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
                    defaultValue={editingAddress?.phone}
                    className="form-input"
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  defaultValue={editingAddress?.street}
                  className="form-input"
                  placeholder="123 Main St"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={editingAddress?.city}
                    className="form-input"
                    placeholder="New York"
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
                    defaultValue={editingAddress?.state}
                    className="form-input"
                    placeholder="NY"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    defaultValue={editingAddress?.zip}
                    className="form-input"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select 
                  name="country"
                  defaultValue={editingAddress?.country || 'US'}
                  className="form-input"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAddress(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No addresses added yet
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <MapPin className="text-gray-400 mr-4 mt-1" size={20} />
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-gray-600">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zip}<br />
                        {address.country}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-gray-500 mt-1">
                          {address.phone}
                        </p>
                      )}
                      {address.is_default && (
                        <span className="inline-block mt-2 text-sm text-gold">
                          Default Address
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(address)}
                      className="p-2 text-blue-600 hover:text-blue-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressesPage;