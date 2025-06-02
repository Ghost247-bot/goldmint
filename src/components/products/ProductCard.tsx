import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  slug: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6 hover:shadow-gold transition-shadow">
        <div className="flex flex-col md:flex-row gap-6">
          <Link to={`/products/${product.slug}`} className="md:w-1/4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </Link>
          <div className="flex-1">
            <Link 
              to={`/products/${product.slug}`}
              className="text-xl font-medium text-charcoal hover:text-gold transition-colors"
            >
              {product.name}
            </Link>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-medium text-gold">
                {formatCurrency(product.price)}
              </span>
              <Link
                to={`/products/${product.slug}`}
                className="btn btn-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant p-4 hover:shadow-gold transition-shadow">
      <Link to={`/products/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      </Link>
      <Link 
        to={`/products/${product.slug}`}
        className="text-lg font-medium text-charcoal hover:text-gold transition-colors"
      >
        {product.name}
      </Link>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-medium text-gold">
          {formatCurrency(product.price)}
        </span>
        <Link
          to={`/products/${product.slug}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard; 