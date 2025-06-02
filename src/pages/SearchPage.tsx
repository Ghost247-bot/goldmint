import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid2X2, List } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  slug: string;
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // TODO: Replace with actual API call
        // Simulated API response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockProducts: Product[] = [
          {
            id: '1',
            name: '1oz Gold Bar',
            description: 'Pure 24K gold bar, 1 troy ounce',
            price: 1999.99,
            image: '/images/products/gold-bar-1oz.jpg',
            category: 'bars',
            slug: '1oz-gold-bar'
          },
          {
            id: '2',
            name: 'Gold Sovereign Coin',
            description: 'Classic British gold sovereign coin',
            price: 499.99,
            image: '/images/products/gold-sovereign.jpg',
            category: 'coins',
            slug: 'gold-sovereign-coin'
          },
          // Add more mock products as needed
        ];
        
        setProducts(mockProducts);
      } catch (err) {
        setError('Failed to load search results. Please try again.');
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-medium text-charcoal mb-4">Search</h1>
            <p className="text-gray-600">Enter a search term to find products</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-charcoal mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            Found {products.length} {products.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {/* Filters and Sort */}
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
          </div>
          
          {/* View toggle */}
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

        {/* Results */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-medium text-charcoal mb-2">No results found</h2>
            <p className="text-gray-600">
              Try adjusting your search terms or browse our categories
            </p>
          </div>
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'grid-cols-1 gap-4'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 