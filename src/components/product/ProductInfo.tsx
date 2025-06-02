import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium text-charcoal-dark mb-2">
          {product.name}
        </h1>
        <p className="text-2xl font-medium text-gold">
          ${product.price.toLocaleString()}
        </p>
      </div>

      <div className="prose prose-sm text-gray-600">
        <p>{product.description}</p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {t('product.specifications')}
          </h3>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">{t('product.weight')}</dt>
              <dd className="text-sm font-medium text-gray-900">{product.weight}g</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">{t('product.purity')}</dt>
              <dd className="text-sm font-medium text-gray-900">{product.purity}%</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">{t('product.dimensions')}</dt>
              <dd className="text-sm font-medium text-gray-900">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">{t('product.origin')}</dt>
              <dd className="text-sm font-medium text-gray-900">{product.origin}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 btn btn-primary"
        >
          {t('product.addToCart')}
        </button>
        <button className="flex-1 btn btn-outline">
          {t('product.buyNow')}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo; 