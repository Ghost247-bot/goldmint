import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { t } = useTranslation();
  return (
    <Link 
      to={`/category/${category.slug}`} 
      className="group block rounded-lg overflow-hidden shadow-elegant hover:shadow-gold transition-shadow duration-300"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img 
          src={category.image} 
          alt={t(`categories.${category.slug}.title`)} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-serif font-medium mb-2">{t(`categories.${category.slug}.title`)}</h3>
          <p className="text-sm text-gray-200 mb-4">{t(`categories.${category.slug}.description`)}</p>
          <div className="flex items-center text-gold group-hover:translate-x-2 transition-transform">
            <span className="text-sm font-medium">{t('categories.explore', 'Explore Collection')}</span>
            <ArrowRight size={16} className="ml-2" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;