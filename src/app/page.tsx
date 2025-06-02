import { Metadata } from 'next';
import HomePage from '@/components/pages/HomePage';

export const metadata: Metadata = {
  title: 'GoldMint | Premium Gold Investment & Products',
  description: 'Discover premium gold investments, coins, bars, and jewelry at GoldMint. Expert market insights and secure storage solutions.',
};

export default function Page() {
  return <HomePage />;
}