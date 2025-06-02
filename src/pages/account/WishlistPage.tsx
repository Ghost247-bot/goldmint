import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    weight: number;
    weight_unit: string;
    purity: string;
    short_description: string;
  };
}

const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select(`
            *,
            product:products (*)
          `)
          .eq('user_id', user?.id);

        if (error) throw error;
        setWishlistItems(data || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const handleAddToCart = async (item: WishlistItem) => {
    addToCart(item.product, 1);
    // Optionally remove from wishlist after adding to cart
    await handleRemoveFromWishlist(item.id);
  };

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWishlistItems(items => items.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <div className="text-center text-gray-500">Loading wishlist...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-medium">My Wishlist</h2>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-md">
            {error}
          </div>
        )}

        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
            <Link to="/" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4">
                    <img 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="md:w-3/4 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link 
                          to={`/products/${item.product.slug}`} 
                          className="text-lg font-medium text-charcoal-dark hover:text-gold transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.product.weight}{item.product.weight_unit} | {item.product.purity} Fine Gold
                        </p>
                      </div>
                      <span className="font-semibold text-lg">
                        ${item.product.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 my-3 line-clamp-2">
                      {item.product.short_description}
                    </p>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="btn btn-sm btn-outline flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Remove
                      </button>
                      
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn btn-sm btn-primary flex items-center"
                      >
                        <ShoppingCart size={16} className="mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;