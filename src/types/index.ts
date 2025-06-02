export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  weight: number;
  weightUnit: string;
  purity: string;
  category: string;
  subcategory?: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  new?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  dimensions: string;
  origin: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface GoldPrice {
  date: string;
  price: number;
  currency: string;
  change: number;
  changePercentage: number;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  category: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}