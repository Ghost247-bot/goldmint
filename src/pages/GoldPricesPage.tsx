import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, TrendingUp } from 'lucide-react';
import { getGoldPriceHistory, getCurrentGoldPrice } from '../data/goldPrices';
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

const GoldPricesPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const currentPrice = getCurrentGoldPrice();
  const priceHistory = getGoldPriceHistory(timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 30);
  
  const calculateChange = () => {
    if (priceHistory.length < 2) return { value: 0, percentage: 0 };
    
    const oldest = priceHistory[0].price;
    const newest = priceHistory[priceHistory.length - 1].price;
    
    const change = newest - oldest;
    const percentage = (change / oldest) * 100;
    
    return {
      value: change,
      percentage
    };
  };
  
  const change = calculateChange();
  
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-charcoal-dark mb-4">
            Gold Price Chart
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Track historical gold prices and market trends to make informed investment decisions.
          </p>
        </div>
        
        {/* Current Price Card */}
        <div className="bg-white rounded-lg shadow-elegant p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left md:border-r md:border-gray-100">
              <h2 className="text-sm text-gray-500 mb-2">Current Gold Price</h2>
              <div className="flex items-center justify-center md:justify-start">
                <TrendingUp className="text-gold mr-2" size={20} />
                <span className="text-3xl font-semibold text-charcoal-dark">
                  ${currentPrice.price.toFixed(2)}
                </span>
                <span className="ml-2 text-xs uppercase text-gray-500">per oz</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(currentPrice.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-center md:border-r md:border-gray-100">
              <h2 className="text-sm text-gray-500 mb-2">24h Change</h2>
              <div className="flex items-center justify-center">
                {currentPrice.change >= 0 ? (
                  <ArrowUpRight className="text-green-500 mr-1\" size={20} />
                ) : (
                  <ArrowDownRight className="text-red-500 mr-1" size={20} />
                )}
                <span className={`text-2xl font-semibold ${currentPrice.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change.toFixed(2)}
                </span>
                <span className={`ml-2 text-sm ${currentPrice.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ({currentPrice.changePercentage >= 0 ? '+' : ''}{currentPrice.changePercentage.toFixed(2)}%)
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                From previous close
              </p>
            </div>
            
            <div className="text-center md:text-right">
              <h2 className="text-sm text-gray-500 mb-2">{timeframe.toUpperCase()} Change</h2>
              <div className="flex items-center justify-center md:justify-end">
                {change.value >= 0 ? (
                  <ArrowUpRight className="text-green-500 mr-1\" size={20} />
                ) : (
                  <ArrowDownRight className="text-red-500 mr-1" size={20} />
                )}
                <span className={`text-2xl font-semibold ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change.value >= 0 ? '+' : ''}{change.value.toFixed(2)}
                </span>
                <span className={`ml-2 text-sm ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ({change.percentage >= 0 ? '+' : ''}{change.percentage.toFixed(2)}%)
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Over {timeframe === '7d' ? '7 days' : timeframe === '30d' ? '30 days' : timeframe === '90d' ? '90 days' : timeframe === '1y' ? '1 year' : 'all time'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-elegant overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-medium">Gold Price Chart</h2>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Timeframe:</span>
              <div className="flex">
                <button
                  onClick={() => setTimeframe('7d')}
                  className={`px-3 py-1 text-sm rounded-l-md ${
                    timeframe === '7d' 
                      ? 'bg-gold text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  7D
                </button>
                <button
                  onClick={() => setTimeframe('30d')}
                  className={`px-3 py-1 text-sm ${
                    timeframe === '30d' 
                      ? 'bg-gold text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  1M
                </button>
                <button
                  onClick={() => setTimeframe('90d')}
                  className={`px-3 py-1 text-sm ${
                    timeframe === '90d' 
                      ? 'bg-gold text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  3M
                </button>
                <button
                  onClick={() => setTimeframe('1y')}
                  className={`px-3 py-1 text-sm ${
                    timeframe === '1y' 
                      ? 'bg-gold text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  1Y
                </button>
                <button
                  onClick={() => setTimeframe('all')}
                  className={`px-3 py-1 text-sm rounded-r-md ${
                    timeframe === 'all' 
                      ? 'bg-gold text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-80 w-full flex items-center justify-center">
              <Line
                data={{
                  labels: priceHistory.map((p) => new Date(p.date).toLocaleDateString()),
                  datasets: [
                    {
                      label: 'Gold Price (USD/oz)',
                      data: priceHistory.map((p) => p.price),
                      fill: true,
                      borderColor: '#FFD700',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    x: {
                      title: { display: true, text: 'Date' },
                      ticks: { maxTicksLimit: 10 },
                    },
                    y: {
                      title: { display: true, text: 'Price (USD/oz)' },
                      beginAtZero: false,
                    },
                  },
                }}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        {/* Historical Data Table */}
        <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-medium">Historical Gold Prices</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {priceHistory.map((price, index) => (
                  <tr key={price.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      {new Date(price.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      ${price.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal">
                      ${price.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${price.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${price.changePercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {price.changePercentage >= 0 ? '+' : ''}{price.changePercentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldPricesPage;