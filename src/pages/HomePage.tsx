import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Truck, CreditCard } from 'lucide-react';
import { categories, getFeaturedCategories } from '../data/categories';
import { getCurrentGoldPrice } from '../data/goldPrices';
import ProductCard from '../components/product/ProductCard';
import HeroSlider from '../components/home/HeroSlider';
import CategoryCard from '../components/category/CategoryCard';
import MarketTicker from '../components/home/MarketTicker';
import NewsSection from '../components/home/NewsSection';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const featuredCategories = getFeaturedCategories();
  const currentPrice = getCurrentGoldPrice();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true);

        if (error) throw error;
        setFeaturedProducts(data);
      } catch (err) {
        setError(t('common.error'));
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [t]);
  
  return (
    <div className="pt-16">
      <MarketTicker />
      <HeroSlider />
      
      {/* Current Gold Price */}
      <div className="bg-gold text-white py-4">
        <div className="container-custom mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-2 md:mb-0">
              <TrendingUp className="mr-2" size={20} />
              <span className="text-lg font-medium">{t('home.goldPrice.title')}: ${currentPrice.price.toFixed(2)}/oz</span>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${currentPrice.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change.toFixed(2)} ({currentPrice.changePercentage.toFixed(2)}%)
              </span>
              <Link to="/gold-prices" className="ml-4 text-sm underline hover:text-white transition-colors">
                {t('home.goldPrice.history')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Categories */}
      <section className="py-16 bg-cream">
        <div className="container-custom mx-auto">
          <h2 className="section-title text-center">{t('home.categories.title')}</h2>
          <p className="section-subtitle text-center">
            {t('home.categories.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {featuredCategories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto">
          <h2 className="section-title text-center">{t('home.featured.title')}</h2>
          <p className="section-subtitle text-center">
            {t('home.featured.subtitle')}
          </p>
          
          {error && (
            <div className="text-center text-red-600 mb-8">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="text-center text-gray-600">{t('common.loading')}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/category/all" 
              className="btn btn-outline inline-flex items-center"
            >
              {t('home.featured.viewAll')}
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* News Section */}
      <NewsSection />
      
      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom mx-auto">
          <h2 className="section-title text-center">{t('home.whyChoose.title')}</h2>
          <p className="section-subtitle text-center">
            {t('home.whyChoose.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            <div className="bg-white p-6 rounded-lg shadow-elegant text-center">
              <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">{t('home.whyChoose.features.authentic.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyChoose.features.authentic.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-elegant text-center">
              <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">{t('home.whyChoose.features.delivery.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyChoose.features.delivery.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-elegant text-center">
              <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">{t('home.whyChoose.features.payment.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyChoose.features.payment.description')}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-elegant text-center">
              <div className="w-14 h-14 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-gold" size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">{t('home.whyChoose.features.investment.title')}</h3>
              <p className="text-gray-600">
                {t('home.whyChoose.features.investment.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call To Action */}
      <section className="py-16 bg-charcoal-dark text-white">
        <div className="container-custom mx-auto text-center">
          <h2 className="text-3xl font-serif font-medium mb-4">{t('home.cta.title')}</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-300">
            {t('home.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/category/bars" className="btn btn-primary">
              {t('home.cta.primary')}
            </Link>
            <Link to="/gold-prices" className="btn btn-outline border-gold text-gold hover:bg-gold hover:text-white">
              {t('home.cta.secondary')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;