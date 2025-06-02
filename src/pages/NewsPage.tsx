import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Mock news data
const newsItems = [
  { id: '1', date: '2024-06-01', image: '/images/news/gold-highs.jpg' },
  { id: '2', date: '2024-05-15', image: '/images/news/platform-launch.jpg' },
  { id: '3', date: '2024-04-28', image: '/images/news/diversify.jpg' },
  { id: '4', date: '2024-04-10', image: '/images/news/central-banks.jpg' },
  { id: '5', date: '2024-03-22', image: '/images/news/jewelry-demand.jpg' },
  { id: '6', date: '2024-03-05', image: '/images/news/gold-vs-crypto.jpg' },
  { id: '7', date: '2024-02-18', image: '/images/news/refinery-partnership.jpg' },
  { id: '8', date: '2024-02-01', image: '/images/news/sustainable-mining.jpg' }
];

const ITEMS_PER_PAGE = 6;

const NewsPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(newsItems.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedNews = newsItems.slice(startIdx, endIdx);

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container-custom mx-auto">
        <h1 className="text-4xl font-serif font-medium text-charcoal-dark mb-4 text-center">
          {t('news.title', 'Latest News & Insights')}
        </h1>
        <p className="text-center text-gray-600 mb-12">
          {t('news.subtitle', 'Stay up to date with the latest news, trends, and insights from the gold market and GoldMint.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedNews.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-elegant overflow-hidden flex flex-col">
              <img src={item.image} alt={t(`news.items.${item.id}.title`)} className="h-48 w-full object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-medium mb-2">
                  {t(`news.items.${item.id}.title`)}
                </h2>
                <p className="text-gray-600 mb-4 flex-1">
                  {t(`news.items.${item.id}.excerpt`)}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <Link to={`/news/${item.id}`} className="text-gold hover:underline">
                    {t('news.readMore', 'Read More')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-12 gap-4">
          <button
            className="btn btn-outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            {t('common.back', 'Back')}
          </button>
          <span className="self-center text-gray-600">
            {t('common.page', 'Page')} {page} / {totalPages}
          </span>
          <button
            className="btn btn-outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            {t('common.next', 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPage; 