import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container-custom mx-auto text-center">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-elegant p-8">
          <h1 className="text-8xl font-serif font-medium text-gold mb-6">404</h1>
          <h2 className="text-3xl font-medium text-charcoal-dark mb-4">{t('notFound.title')}</h2>
          <p className="text-gray-600 mb-8">
            {t('notFound.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="btn btn-primary flex items-center justify-center">
              <Home size={18} className="mr-2" />
              {t('notFound.backToHome')}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              {t('notFound.goBack')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;