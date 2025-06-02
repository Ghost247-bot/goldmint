import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid2X2, List, ChevronDown } from 'lucide-react';
import { getCategoryBySlug } from '../data/categories';
import ProductCard from '../components/product/ProductCard';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const categoryData = getCategoryBySlug(category || '');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedPurity, setSelectedPurity] = useState<string[]>([]);
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Verify Supabase URL and key are present
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          throw new Error('Supabase configuration is missing');
        }

        let query = supabase
          .from('products')
          .select('*');
        
        if (category && category !== 'all') {
          query = query.eq('category', category);
        }
        
        // Apply price filter
        query = query
          .gte('price', priceRange[0])
          .lte('price', priceRange[1]);
        
        // Apply purity filter
        if (selectedPurity.length > 0) {
          query = query.in('purity', selectedPurity);
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'featured':
          default:
            query = query.order('featured', { ascending: false });
            break;
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) {
          console.error('Supabase error:', fetchError);
          throw new Error('Failed to fetch products');
        }

        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortBy, priceRange, selectedPurity, t]);
  
  const togglePurity = (purity: string) => {
    if (selectedPurity.includes(purity)) {
      setSelectedPurity(selectedPurity.filter(p => p !== purity));
    } else {
      setSelectedPurity([...selectedPurity, purity]);
    }
  };
  
  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedPurity([]);
  };
  
  // Get unique purities
  const purities = Array.from(new Set(products.map(product => product.purity)));
  
  if (isLoading) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto text-center">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto text-center">
          <div className="bg-white rounded-lg shadow-elegant p-8">
            <h2 className="text-xl font-medium text-red-600 mb-4">{t('common.error')}</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              {t('common.tryAgain')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-gold transition-colors">{t('common.home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal capitalize">{category}</span>
        </div>
        
        {/* Category header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-charcoal-dark mb-4 capitalize">
            {t(`categories.${category}.title`, { defaultValue: categoryData?.name || category })}
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t(`categories.${category}.description`, { defaultValue: categoryData?.description || '' })}
          </p>
        </div>
        
        {/* Filters and sorting */}
        <div className="bg-white rounded-lg shadow-elegant p-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="md:hidden flex items-center text-charcoal hover:text-gold transition-colors mb-4 md:mb-0"
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
          
          {/* Desktop filters */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-none bg-transparent text-charcoal focus:outline-none text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            
            <div className="h-6 w-px bg-gray-200"></div>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">{products.length} products</span>
            </div>
          </div>
          
          {/* Sort (mobile) and view toggle */}
          <div className="w-full md:w-auto flex justify-between items-center">
            <div className="md:hidden">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-md p-2 text-sm text-charcoal bg-white"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Sort: Price Low to High</option>
                <option value="price-high">Sort: Price High to Low</option>
                <option value="newest">Sort: Newest</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-gold-light text-gold' 
                    : 'bg-transparent text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <Grid2X2 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-gold-light text-gold' 
                    : 'bg-transparent text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className={`md:w-1/4 lg:w-1/5 md:block ${filtersOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-elegant p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Filters</h3>
                {(priceRange[0] > 0 || priceRange[1] < 10000 || selectedPurity.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gold hover:text-gold-dark transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 flex justify-between items-center">
                  <span>Price Range</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">${priceRange[0]}</span>
                    <span className="text-sm text-gray-500">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-gold"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-gold"
                  />
                </div>
              </div>
              
              {/* Purity Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-3 flex justify-between items-center">
                  <span>Purity</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="space-y-2">
                  {purities.map((purity) => (
                    <label key={purity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPurity.includes(purity)}
                        onChange={() => togglePurity(purity)}
                        className="mr-2 accent-gold w-4 h-4"
                      />
                      <span className="text-sm">{purity} {category === 'silver' ? 'Fine Silver' : 'Fine Gold'}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Availability */}
              <div>
                <h4 className="text-sm font-medium mb-3 flex justify-between items-center">
                  <span>Availability</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      className="mr-2 accent-gold w-4 h-4"
                      readOnly
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="md:w-3/4 lg:w-4/5">
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-elegant p-8 text-center">
                <h3 className="text-xl font-medium mb-2">{t('common.noResults')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('common.tryAdjustingFilters')}
                </p>
                <Link to="/" className="btn btn-primary">
                  {t('common.backToHome')}
                </Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-elegant overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <Link to={`/products/${product.slug}`} className="block h-full">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="md:w-2/3 p-6">
                        <Link to={`/products/${product.slug}`} className="block">
                          <h3 className="text-xl font-medium text-charcoal-dark hover:text-gold transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-2 mb-4">
                          {product.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {product.weight}{product.weightUnit}
                          </span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {product.purity} Fine Gold
                          </span>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <span className="text-xl font-semibold text-charcoal-dark">
                              ${product.price.toLocaleString()}
                            </span>
                            {product.discount && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${(product.price * (1 + product.discount / 100)).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Link 
                            to={`/products/${product.slug}`} 
                            className="btn btn-primary btn-sm"
                          >
                            {t('common.viewDetails')}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;