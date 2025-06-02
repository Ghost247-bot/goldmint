import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, UserPlus, Mail, Key } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string;
  total_amount: number;
  status: string;
}

interface Investment {
  id: string;
  amount: number;
  status: string;
}

interface SecuritySetting {
  two_factor_enabled: boolean;
  last_password_change: string | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at?: string;
  orders?: Order[];
  investments?: Investment[];
  security_settings?: SecuritySetting[];
  totalOrders?: number;
  totalSpent?: number;
  activeInvestments?: number;
  hasTwoFactor?: boolean;
  lastPasswordChange?: string | null;
}

// Admin Note: created_at and updated_at fields are now admin-editable because the DB trigger that auto-updated updated_at was removed.

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    created_at: '',
    updated_at: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch users from profiles table with complete data
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          security_settings (
            two_factor_enabled,
            last_password_change
          ),
          orders!orders_user_id_fkey (
            id,
            total_amount,
            status
          ),
          investments (
            id,
            amount,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      
      // Transform the data to include additional user stats
      const transformedUsers = profilesData?.map(profile => ({
        ...profile,
        totalOrders: profile.orders?.length || 0,
        totalSpent: profile.orders?.reduce((sum: number, order: Order) => sum + Number(order.total_amount), 0) || 0,
        activeInvestments: profile.investments?.filter((inv: Investment) => inv.status === 'active').length || 0,
        hasTwoFactor: profile.security_settings?.[0]?.two_factor_enabled || false,
        lastPasswordChange: profile.security_settings?.[0]?.last_password_change || null,
        updated_at: profile.updated_at
      })) || [];

      setUsers(transformedUsers);

    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user account');

      // Then create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          created_at: formData.created_at,
          updated_at: formData.updated_at
        }]);

      if (profileError) throw profileError;

      // Refresh users list
      await fetchUsers();

      // Reset form and close modal
      setFormData({ name: '', email: '', password: '', created_at: '', updated_at: '' });
      setShowAddModal(false);

    } catch (err: unknown) {
      console.error('Error adding user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add user';
      alert(errorMessage);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          email: formData.email,
          created_at: formData.created_at,
          updated_at: formData.updated_at
        })
        .eq('id', editingUser.id);

      if (profileError) throw profileError;

      // Refresh users list
      await fetchUsers();

      // Reset form and close modal
      setFormData({ name: '', email: '', password: '', created_at: '', updated_at: '' });
      setEditingUser(null);
      setShowEditModal(false);

    } catch (err: unknown) {
      console.error('Error updating user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      alert(errorMessage);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      // Delete from auth (this will cascade to profile due to foreign key)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;

      setUsers(users.filter(user => user.id !== userId));

    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      created_at: user.created_at || '',
      updated_at: user.updated_at || ''
    });
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-xl font-medium">Users Management</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center"
            >
              <UserPlus size={18} className="mr-2" />
              Add User
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
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Orders</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total Spent</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Active Investments</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Security</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Joined</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.totalOrders || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    ${user.totalSpent?.toLocaleString() || '0'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {user.activeInvestments || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.hasTwoFactor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.hasTwoFactor ? '2FA Enabled' : '2FA Disabled'}
                      </span>
                      {user.lastPasswordChange && (
                        <span className="text-xs text-gray-500">
                          Last changed: {new Date(user.lastPasswordChange).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                    minLength={6}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Created
                </label>
                <input
                  type="datetime-local"
                  value={formData.created_at ? formData.created_at.slice(0, 16) : ''}
                  onChange={e => setFormData(prev => ({ ...prev, created_at: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  required
                />
                {/* Admins can now edit this field because the DB trigger was removed */}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Updated
                </label>
                <input
                  type="datetime-local"
                  value={formData.updated_at ? formData.updated_at.slice(0, 16) : ''}
                  onChange={e => setFormData(prev => ({ ...prev, updated_at: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  required
                />
                {/* Admins can now edit this field because the DB trigger was removed */}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: '', email: '', password: '', created_at: '', updated_at: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Edit User</h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-gold focus:border-gold"
                    minLength={6}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Created
                </label>
                <input
                  type="datetime-local"
                  value={formData.created_at ? formData.created_at.slice(0, 16) : ''}
                  onChange={e => setFormData(prev => ({ ...prev, created_at: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Updated
                </label>
                <input
                  type="datetime-local"
                  value={formData.updated_at ? formData.updated_at.slice(0, 16) : ''}
                  onChange={e => setFormData(prev => ({ ...prev, updated_at: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setFormData({ name: '', email: '', password: '', created_at: '', updated_at: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;