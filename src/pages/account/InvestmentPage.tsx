import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { products } from '../../data/products';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const InvestmentPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    const fetchInvestments = async () => {
      setIsLoading(true);
      try {
        // Fetch completed orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              product:products (*)
            )
          `)
          .eq('user_id', user?.id)
          .eq('status', 'completed');

        if (ordersError) throw ordersError;

        // Fetch investments
        const { data: investmentsData, error: investmentsError } = await supabase
          .from('investments')
          .select(`
            *,
            product:products (name, category)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (investmentsError) throw investmentsError;

        // Map investments to match the order_items structure for display
        const mappedInvestments = (investmentsData || []).map((inv: any) => {
          // Find product details from local products data for images
          const productDetails = products.find(p => p.id === inv.product_id);
          return {
            id: inv.id,
            quantity: inv.quantity,
            price: inv.purchase_price,
            current_value: inv.current_value,
            product: {
              name: inv.product?.name || productDetails?.name || '',
              category: inv.product?.category || productDetails?.category || '',
              images: productDetails?.images || [],
            },
            isInvestment: true,
          };
        });

        // Flatten order items
        const mappedOrders = (orders || []).flatMap((order: any) =>
          (order.order_items || []).map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            current_value: item.price * 1.085, // mimic current value logic
            product: item.product,
            isInvestment: false,
          }))
        );

        // Merge both sources
        const allInvestments = [...mappedOrders, ...mappedInvestments];
        setInvestments(allInvestments);

        // Calculate total portfolio value
        const total = allInvestments.reduce((sum, item) => sum + Number(item.current_value), 0);
        setPortfolioValue(total);
      } catch (err) {
        console.error('Error fetching investments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchInvestments();
  }, [user]);

  // Generate chart data for portfolio value over time
  const chartData = React.useMemo(() => {
    // Sort investments by created_at if available, else use id as fallback
    const sorted = [...investments].sort((a, b) => {
      if (a.created_at && b.created_at) {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return (a.id > b.id ? 1 : -1);
    });
    let runningTotal = 0;
    const labels: string[] = [];
    const values: number[] = [];
    sorted.forEach((item) => {
      runningTotal += Number(item.current_value) || 0;
      labels.push(item.created_at ? new Date(item.created_at).toLocaleDateString() : item.id);
      values.push(runningTotal);
    });
    return {
      labels,
      datasets: [
        {
          label: 'Portfolio Value',
          data: values,
          fill: true,
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          tension: 0.3,
        },
      ],
    };
  }, [investments]);

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-medium">Investment Portfolio</h2>
      </div>
      
      <div className="p-6">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center">
                <DollarSign className="text-gold" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Portfolio Value</h3>
                <p className="text-2xl font-semibold">${portfolioValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Return</h3>
                <div className="flex items-center">
                  <ArrowUpRight className="text-green-500 mr-1" size={20} />
                  <p className="text-2xl font-semibold text-green-500">+8.5%</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart2 className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm text-gray-500">Total Assets</h3>
                <p className="text-2xl font-semibold">{investments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Holdings */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Investment Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Purchase Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Current Value</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Return</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {investments.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img 
                          src={item.product.images?.[0] || ''}
                          alt={item.product.name}
                          className="w-10 h-10 rounded object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">{item.product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">${item.price.toLocaleString()}</td>
                    <td className="px-4 py-3">${item.current_value.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={item.current_value - item.price * item.quantity >= 0 ? 'text-green-500 flex items-center' : 'text-red-500 flex items-center'}>
                        <ArrowUpRight size={16} className="mr-1" />
                        {item.isInvestment
                          ? `$${(item.current_value - item.price * item.quantity).toLocaleString()}`
                          : '+8.5%'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.isInvestment && (
                        <Link to={`/account/investments/${item.id}`} className="text-gold hover:text-gold-dark font-medium text-sm">View Details</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Investment Performance Chart */}
        <div>
          <h3 className="text-lg font-medium mb-4">Performance History</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="h-64 flex items-center justify-center text-gray-500">
              {investments.length > 0 ? (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      x: { title: { display: true, text: 'Date' } },
                      y: { title: { display: true, text: 'Portfolio Value ($)' } },
                    },
                  }}
                />
              ) : (
                <span>Performance chart will be displayed here</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;