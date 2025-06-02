import React, { useState } from 'react';
import { Bell } from 'lucide-react';

interface PriceAlertProps {
  productId: string;
  currentPrice: number;
}

const PriceAlert: React.FC<PriceAlertProps> = ({ productId, currentPrice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState(currentPrice);
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the alert settings to a backend service
    console.log('Price alert set:', { productId, targetPrice, email });
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gold hover:text-gold-dark transition-colors flex items-center"
      >
        <Bell size={18} className="mr-1" />
        Set Price Alert
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-elegant p-4 z-20">
          <h4 className="text-lg font-medium mb-4">Set Price Alert</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Price ($)
              </label>
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="form-input"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Set Alert
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PriceAlert;