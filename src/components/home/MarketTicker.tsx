import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getCurrentGoldPrice } from '../../data/goldPrices';

const MarketTicker: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(getCurrentGoldPrice());
  
  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const price = getCurrentGoldPrice();
      const variation = (Math.random() * 2 - 1) * 0.5; // Random variation between -0.5 and +0.5
      setCurrentPrice({
        ...price,
        price: price.price + variation,
        change: variation,
        changePercentage: (variation / price.price) * 100
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-charcoal-dark text-white py-2 overflow-hidden">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <span className="text-gold mr-2">XAU/USD</span>
              <span className="font-medium">${currentPrice.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center">
              <span className={currentPrice.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {currentPrice.change >= 0 ? (
                  <TrendingUp size={16} className="inline mr-1" />
                ) : (
                  <TrendingDown size={16} className="inline mr-1" />
                )}
                {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change.toFixed(2)}
                ({currentPrice.changePercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;