import React from 'react';
import { ArrowRight } from 'lucide-react';

const newsItems = [
  {
    id: 1,
    title: 'Gold Prices Surge Amid Global Economic Uncertainty',
    excerpt: 'Market analysts predict continued growth in gold prices as investors seek safe-haven assets.',
    image: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg',
    date: '2025-05-01'
  },
  {
    id: 2,
    title: 'New Premium Gold Bar Collection Launch',
    excerpt: 'GoldMint introduces exclusive series of limited edition gold bars featuring unique designs.',
    image: 'https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg',
    date: '2025-04-28'
  },
  {
    id: 3,
    title: 'Investment Guide: Building a Gold Portfolio',
    excerpt: 'Expert insights on diversifying your investment portfolio with precious metals.',
    image: 'https://images.pexels.com/photos/4386429/pexels-photo-4386429.jpeg',
    date: '2025-04-25'
  }
];

const NewsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-medium text-charcoal-dark">
            Latest News & Insights
          </h2>
          <a href="/news" className="text-gold hover:text-gold-dark transition-colors flex items-center">
            View All News
            <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map(item => (
            <article key={item.id} className="bg-white rounded-lg shadow-elegant overflow-hidden group">
              <a href={`/news/${item.id}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <time className="text-sm text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <h3 className="text-xl font-medium mt-2 mb-3 text-charcoal-dark group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.excerpt}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;