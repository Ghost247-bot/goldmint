import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Shield, Edit, Trash2, Eye } from 'lucide-react';

interface SecuritySetting {
  user_id: string;
  two_factor_enabled: boolean;
  last_password_change: string | null;
  created_at: string;
  updated_at: string;
  profile: {
    name: string;
    email: string;
  };
}

const SecurityManagement: React.FC = () => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SecuritySetting | null>(null);

  useEffect(() => {
    fetchSecuritySettings();
  }, []);

  const fetchSecuritySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('security_settings')
        .select(`
          *,
          profile:profiles!security_settings_user_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSecuritySettings(data || []);
    } catch (err) {
      console.error('Error fetching security settings:', err);
      setError('Failed to load security settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (setting: SecuritySetting) => {
    setSelectedSetting(setting);
    setShowViewModal(true);
  };

  const handleEdit = (setting: SecuritySetting) => {
    setSelectedSetting(setting);
    setShowEditModal(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this security setting?')) return;

    try {
      const { error } = await supabase
        .from('security_settings')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      setSecuritySettings(settings => settings.filter(s => s.user_id !== userId));
    } catch (err) {
      console.error('Error deleting security setting:', err);
      alert('Failed to delete security setting');
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSetting) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        two_factor_enabled: formData.get('two_factor_enabled') === 'true'
      };

      const { error } = await supabase
        .from('security_settings')
        .update(updates)
        .eq('user_id', selectedSetting.user_id);

      if (error) throw error;

      await fetchSecuritySettings();
      setShowEditModal(false);
      setSelectedSetting(null);
    } catch (err) {
      console.error('Error updating security setting:', err);
      alert('Failed to update security setting');
    }
  };

  const filteredSettings = securitySettings.filter(setting =>
    setting.profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.profile.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-xl font-medium">Security Management</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">2FA Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Last Password Change</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Created At</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSettings.map((setting) => (
                <tr key={setting.user_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{setting.profile.name}</td>
                  <td className="px-4 py-3 text-gray-500">{setting.profile.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      setting.two_factor_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <Shield size={12} className="mr-1" />
                      {setting.two_factor_enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {setting.last_password_change
                      ? new Date(setting.last_password_change).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(setting.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(setting)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(setting)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Security Settings"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(setting.user_id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Security Settings"
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
      </div>

      {/* View Modal */}
      {showViewModal && selectedSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Security Settings Details</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">User Information</h4>
                <p className="mt-1">{selectedSetting.profile.name}</p>
                <p className="text-gray-500">{selectedSetting.profile.email}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Two-Factor Authentication</h4>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedSetting.two_factor_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <Shield size={12} className="mr-1" />
                    {selectedSetting.two_factor_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Password Change</h4>
                <p className="mt-1">
                  {selectedSetting.last_password_change
                    ? new Date(selectedSetting.last_password_change).toLocaleString()
                    : 'Never'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Account Created</h4>
                <p className="mt-1">{new Date(selectedSetting.created_at).toLocaleString()}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                <p className="mt-1">{new Date(selectedSetting.updated_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedSetting(null);
                }}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium mb-4">Edit Security Settings</h3>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">User Information</h4>
                <p className="text-gray-600">{selectedSetting.profile.name}</p>
                <p className="text-gray-500">{selectedSetting.profile.email}</p>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="two_factor_enabled"
                    defaultChecked={selectedSetting.two_factor_enabled}
                    value="true"
                    className="rounded border-gray-300 text-gold focus:ring-gold"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedSetting(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityManagement;