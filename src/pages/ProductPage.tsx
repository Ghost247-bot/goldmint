import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Minus, Plus, ShoppingCart, Heart, Shield, 
  Truck, ArrowLeft, Star, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/product/ProductCard';
import PriceAlert from '../components/product/PriceAlert';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import RelatedProducts from '../components/product/RelatedProducts';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (productError) throw productError;
        if (!productData) throw new Error('Product not found');
        
        console.log('Raw product data from database:', productData);
        
        // Transform database fields to match TypeScript interface
        const transformedProduct: Product = {
          id: productData.id,
          name: productData.name,
          slug: productData.slug,
          description: productData.description,
          shortDescription: productData.short_description,
          price: productData.price,
          currency: productData.currency || 'USD',
          weight: productData.weight,
          weightUnit: productData.weight_unit,
          purity: productData.purity,
          category: productData.category,
          subcategory: productData.subcategory,
          images: productData.images || [],
          inStock: productData.in_stock,
          featured: productData.featured,
          new: productData.is_new,
          discount: productData.discount,
          rating: productData.rating,
          reviews: productData.reviews_count,
          dimensions: productData.dimensions || 'N/A',
          origin: productData.origin || 'N/A',
          createdAt: productData.created_at,
          updatedAt: productData.updated_at
        };
        
        console.log('Transformed product data:', transformedProduct);
        
        setProduct(transformedProduct);
        
        // Fetch related products
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('category', productData.category)
          .neq('id', productData.id)
          .limit(4);
        
        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData || []);
      } catch (err) {
        setError(t('common.error'));
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, t]);
  
  if (isLoading) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto text-center">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-2xl font-medium text-red-600 mb-4">
            {error || t('common.productNotFound')}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    );
  }
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const nextImage = () => {
    if (product?.images) {
      setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };
  
  const prevImage = () => {
    if (product?.images) {
      setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };
  
  const handleAddToWishlist = async () => {
    if (!user) {
      setWishlistError('You must be logged in to add to wishlist.');
      return;
    }
    setWishlistLoading(true);
    setWishlistError(null);
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({ user_id: user.id, product_id: product?.id });
      if (error) throw error;
      setWishlistError('Added to wishlist!');
    } catch (err: any) {
      setWishlistError(err.message || 'Failed to add to wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };
  
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${product.category}`} className="hover:text-gold transition-colors capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal truncate">{product.name}</span>
        </div>
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-charcoal hover:text-gold transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>{t('common.back')}</span>
        </button>
        
        {/* Product details */}
        <div className="bg-white rounded-lg shadow-elegant overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product images */}
            <div className="p-6 md:p-8">
              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Image navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                        index === activeImage ? 'border-gold' : 'border-transparent'
                      }`}
                      
                      aria-label={`Image ${index + 1}`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product info */}
            <div className="p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100">
              {/* Product badges */}
              <div className="flex gap-2 mb-4">
                {product.new && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                )}
                {product.featured && (
                  <span className="bg-gold text-white text-xs px-2 py-1 rounded">Featured</span>
                )}
                {product.discount && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale: {product.discount}% Off
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-serif font-medium text-charcoal-dark mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={`${i < Math.floor(product.rating || 0) ? 'text-gold' : 'text-gray-300'}`}
                        fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  {product.reviews && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.reviews} {t('product.reviews')})
                    </span>
                  )}
                </div>
              )}
              
              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-semibold text-charcoal-dark">
                  ${Number(product?.price ?? 0).toLocaleString()}
                </span>
                {product.discount && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${(
                      Number(product?.price ?? 0) * (1 + Number(product?.discount ?? 0) / 100)
                    ).toFixed(2)}
                  </span>
                )}
                <div className="mt-2">
                  <PriceAlert productId={product.id} currentPrice={product.price} />
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                {product.shortDescription}
              </p>
              
              {/* Product details */}
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weight:</span>
                  <span className="font-medium">{product.weight} {product.weightUnit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Purity:</span>
                  <span className="font-medium">{product.purity} Fine Gold</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Availability:</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
              
              {/* Add to cart */}
              {product.inStock ? (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center border border-gray-300 rounded-md mr-4">
                      <button 
                        onClick={decrementQuantity}
                        className="px-3 py-2 border-r border-gray-300 hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button 
                        onClick={incrementQuantity}
                        className="px-3 py-2 border-l border-gray-300 hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAddToCart}
                      className="btn btn-primary flex-1 flex justify-center items-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                  
                  <button 
                    className="btn btn-outline w-full flex justify-center items-center"
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading}
                  >
                    <Heart size={18} className="mr-2" />
                    {wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
                  </button>
                  {wishlistError && <div className="text-sm text-red-500 mt-2">{wishlistError}</div>}
                </div>
              ) : (
                <div className="mb-8">
                  <button
                    disabled
                    className="btn w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                  <button 
                    className="btn btn-outline w-full flex justify-center items-center mt-4"
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading}
                  >
                    <Heart size={18} className="mr-2" />
                    {wishlistLoading ? 'Adding...' : 'Add to Wishlist'}
                  </button>
                  {wishlistError && <div className="text-sm text-red-500 mt-2">{wishlistError}</div>}
                </div>
              )}
              
              {/* Benefits */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div className="flex items-center">
                  <Shield className="text-gold mr-3" size={20} />
                  <span className="text-sm">
                    <span className="font-medium">Guaranteed Authenticity</span> - All products certified
                  </span>
                </div>
                <div className="flex items-center">
                  <Truck className="text-gold mr-3" size={20} />
                  <span className="text-sm">
                    <span className="font-medium">Secure Shipping</span> - Fully insured delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-t border-gray-100">
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'description' 
                    ? 'text-gold border-b-2 border-gold' 
                    : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'specifications' 
                    ? 'text-gold border-b-2 border-gold' 
                    : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'reviews' 
                    ? 'text-gold border-b-2 border-gold' 
                    : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                Reviews ({product.reviews})
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-100 rounded-md overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 font-medium">Basic Information</div>
                      <div className="divide-y divide-gray-100">
                        <div className="px-4 py-3 flex justify-between">
                          <span className="text-gray-500">Product Type</span>
                          <span className="font-medium capitalize">{product.category}</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between">
                          <span className="text-gray-500">Weight</span>
                          <span className="font-medium">{product.weight} {product.weightUnit}</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between">
                          <span className="text-gray-500">Purity</span>
                          <span className="font-medium">{product.purity} Fine Gold</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 rounded-md overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 font-medium">Additional Details</div>
                      <div className="divide-y divide-gray-100">
                        <div className="px-4 py-3 flex justify-between">
                          <span className="text-gray-500">Manufacturer</span>
                          <span className="font-medium">GoldMint</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between">
                          <span className="text-gray-500">Country of Origin</span>
                          <span className="font-medium">Switzerland</span>
                        </div>
                        <div className="px-4 py-3 flex justify-between">
                          <span className="text-gray-500">Certification</span>
                          <span className="font-medium">Included</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
                  <div className="mb-6 flex items-center">
                    <div className="flex mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={20} 
                          className={`${i < Math.floor(product.rating || 0) ? 'text-gold' : 'text-gray-300'}`}
                          fill={i < Math.floor(product.rating || 0) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium">
                      {product.rating} out of 5
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      Based on {product.reviews} reviews
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6">
                    <p className="text-center text-gray-500">
                      Reviews will be displayed here. This is a demo website.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;