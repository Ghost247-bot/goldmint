import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, currentProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .neq('id', currentProductId)
          .limit(4);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, currentProductId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-elegant p-6">
        <h2 className="text-2xl font-serif font-medium text-charcoal-dark mb-6">
          {t('product.relatedProducts')}
        </h2>
        <div className="text-center text-gray-600">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-elegant p-6">
      <h2 className="text-2xl font-serif font-medium text-charcoal-dark mb-6">
        {t('product.relatedProducts')}
      </h2>
      <div className="grid grid-cols-1 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 