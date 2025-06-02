import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product, 1);
  };
  
  return (
    <div className="product-card group">
      {/* Product image */}
      <Link to={`/products/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.new && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
          )}
          {product.featured && (
            <span className="bg-gold text-white text-xs px-2 py-1 rounded">Featured</span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
        </div>
        
        {/* Quick actions */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-between">
          <button 
            onClick={handleAddToCart}
            className="bg-gold text-white p-2 rounded-full hover:bg-gold-dark transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
          <button 
            className="bg-white text-charcoal p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart size={16} />
          </button>
        </div>
      </Link>
      
      {/* Product info */}
      <div className="p-4">
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="text-lg font-medium text-charcoal-dark hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {product.weight}{product.weightUnit} | {product.purity} Fine Gold
          </p>
        </Link>
        
        {/* Price */}
        <div className="mt-2 flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold text-charcoal-dark">
              ${product.price.toLocaleString()}
            </span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${(product.price * (1 + product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gold">
                {product.rating}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;