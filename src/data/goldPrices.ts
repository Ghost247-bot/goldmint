import { GoldPrice } from '../types';

// Mock data for gold prices over the last 30 days
export const goldPrices: GoldPrice[] = [
  { date: '2025-05-01', price: 2152.30, currency: 'USD', change: 12.45, changePercentage: 0.58 },
  { date: '2025-04-30', price: 2139.85, currency: 'USD', change: -5.20, changePercentage: -0.24 },
  { date: '2025-04-29', price: 2145.05, currency: 'USD', change: 8.75, changePercentage: 0.41 },
  { date: '2025-04-28', price: 2136.30, currency: 'USD', change: -3.65, changePercentage: -0.17 },
  { date: '2025-04-27', price: 2139.95, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-26', price: 2139.95, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-25', price: 2139.95, currency: 'USD', change: 15.80, changePercentage: 0.74 },
  { date: '2025-04-24', price: 2124.15, currency: 'USD', change: -8.35, changePercentage: -0.39 },
  { date: '2025-04-23', price: 2132.50, currency: 'USD', change: 5.60, changePercentage: 0.26 },
  { date: '2025-04-22', price: 2126.90, currency: 'USD', change: 11.25, changePercentage: 0.53 },
  { date: '2025-04-21', price: 2115.65, currency: 'USD', change: -7.40, changePercentage: -0.35 },
  { date: '2025-04-20', price: 2123.05, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-19', price: 2123.05, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-18', price: 2123.05, currency: 'USD', change: 9.30, changePercentage: 0.44 },
  { date: '2025-04-17', price: 2113.75, currency: 'USD', change: -4.85, changePercentage: -0.23 },
  { date: '2025-04-16', price: 2118.60, currency: 'USD', change: 6.70, changePercentage: 0.32 },
  { date: '2025-04-15', price: 2111.90, currency: 'USD', change: 14.55, changePercentage: 0.69 },
  { date: '2025-04-14', price: 2097.35, currency: 'USD', change: -2.95, changePercentage: -0.14 },
  { date: '2025-04-13', price: 2100.30, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-12', price: 2100.30, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-11', price: 2100.30, currency: 'USD', change: 7.85, changePercentage: 0.37 },
  { date: '2025-04-10', price: 2092.45, currency: 'USD', change: -6.10, changePercentage: -0.29 },
  { date: '2025-04-09', price: 2098.55, currency: 'USD', change: 10.20, changePercentage: 0.49 },
  { date: '2025-04-08', price: 2088.35, currency: 'USD', change: -9.75, changePercentage: -0.47 },
  { date: '2025-04-07', price: 2098.10, currency: 'USD', change: 5.40, changePercentage: 0.26 },
  { date: '2025-04-06', price: 2092.70, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-05', price: 2092.70, currency: 'USD', change: 0.00, changePercentage: 0.00 },
  { date: '2025-04-04', price: 2092.70, currency: 'USD', change: 13.60, changePercentage: 0.65 },
  { date: '2025-04-03', price: 2079.10, currency: 'USD', change: -5.85, changePercentage: -0.28 },
  { date: '2025-04-02', price: 2084.95, currency: 'USD', change: 8.15, changePercentage: 0.39 }
];

export const getCurrentGoldPrice = (): GoldPrice => {
  return goldPrices[0];
};

export const getGoldPriceHistory = (days = 30): GoldPrice[] => {
  return goldPrices.slice(0, days).reverse();
};