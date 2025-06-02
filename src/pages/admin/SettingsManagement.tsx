import React from 'react';

const SettingsManagement: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-elegant">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-medium">Settings Management</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-medium mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold"
                  placeholder="Enter site name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold"
                  placeholder="Enter contact email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="max-w-xl">
            <h3 className="text-lg font-medium mb-4">Email Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold"
                  placeholder="Enter SMTP host"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-gold focus:border-gold"
                  placeholder="Enter SMTP port"
                />
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="button"
              className="px-4 py-2 bg-gold text-white rounded-md hover:bg-gold-dark transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;