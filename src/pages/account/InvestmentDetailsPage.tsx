import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ChevronLeft } from 'lucide-react';

interface Investment {
  id: string;
  product_id: string;
  quantity: number;
  purchase_price: number;
  current_value: number;
  created_at: string;
  product?: {
    name: string;
    category: string;
  };
}

const InvestmentDetailsPage: React.FC = () => {
  const { investmentId } = useParams<{ investmentId: string }>();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*, product:products(name, category)')
          .eq('id', investmentId)
          .single();
        if (error) throw error;
        setInvestment(data);
      } catch (err) {
        setError('Failed to load investment details');
      } finally {
        setIsLoading(false);
      }
    };
    if (investmentId) fetchInvestment();
  }, [investmentId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Loading investment details...</div>
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-red-600">{error || 'Investment not found'}</div>
        <div className="mt-4 text-center">
          <Link to="/account/investments" className="text-gold flex items-center justify-center">
            <ChevronLeft size={16} className="mr-1" /> Back to Investments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-2xl font-medium">Investment Details</h2>
        <Link to="/account/investments" className="text-gold flex items-center">
          <ChevronLeft size={16} className="mr-1" /> Back to Investments
        </Link>
      </div>
      <div className="p-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span className="text-sm text-gray-500">Investment #:</span>
            <span className="font-medium ml-1">{investment.id}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Date:</span>
            <span className="ml-1">{new Date(investment.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-lg font-medium mb-2">Product</h3>
          <div className="mb-2">
            <span className="font-medium">{investment.product?.name}</span>
            <span className="ml-2 text-sm text-gray-500">({investment.product?.category})</span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-gray-500">Quantity:</span>
            <span className="ml-1 font-medium">{investment.quantity}</span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-gray-500">Purchase Price:</span>
            <span className="ml-1 font-medium">${investment.purchase_price.toLocaleString()}</span>
          </div>
          <div className="mb-2">
            <span className="text-sm text-gray-500">Current Value:</span>
            <span className="ml-1 font-medium">${investment.current_value.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetailsPage; 