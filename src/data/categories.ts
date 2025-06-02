import { Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Gold Bars',
    slug: 'bars',
    description: 'Invest in premium gold bars ranging from 1g to 1kg, all verified for purity and quality.',
    image: 'https://images.pexels.com/photos/4386429/pexels-photo-4386429.jpeg',
    featured: true
  },
  {
    id: '2',
    name: 'Gold Coins',
    slug: 'coins',
    description: 'Discover our collection of gold coins from mints around the world, perfect for collectors and investors.',
    image: 'https://images.pexels.com/photos/6770610/pexels-photo-6770610.jpeg',
    featured: true
  },
  {
    id: '3',
    name: 'Gold Jewelry',
    slug: 'jewelry',
    description: 'Elegant gold jewelry pieces that combine investment value with timeless beauty.',
    image: 'https://images.pexels.com/photos/11638029/pexels-photo-11638029.jpeg',
    featured: true
  },
  {
    id: '4',
    name: 'Gold ETFs',
    slug: 'etfs',
    description: 'Easy access to gold investments through Exchange-Traded Funds without physical storage.',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg',
    featured: false
  },
  {
    id: '5',
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Limited edition and rare gold items for the discerning collector.',
    image: 'https://images.pexels.com/photos/6770783/pexels-photo-6770783.jpeg',
    featured: false
  }
];

export const getFeaturedCategories = (): Category[] => {
  return categories.filter(category => category.featured);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};