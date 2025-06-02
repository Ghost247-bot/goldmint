import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Mock news data (should match NewsPage)
const newsItems = [
  {
    id: "1",
    title: "Gold Prices Hit New Highs in 2024",
    content: "The price of gold has reached a new record, driven by global economic uncertainty and increased demand. Experts believe this trend will continue as investors seek safe-haven assets. GoldMint analysts recommend monitoring the market closely for further opportunities.",
    date: "2024-06-01",
    image: "/images/news/gold-highs.jpg"
  },
  {
    id: "2",
    title: "GoldMint Launches New Investment Platform",
    content: "GoldMint introduces a modern platform for gold investors, offering enhanced security and transparency. The new platform features real-time pricing, secure transactions, and a user-friendly interface.",
    date: "2024-05-15",
    image: "/images/news/platform-launch.jpg"
  },
  {
    id: "3",
    title: "How to Diversify Your Portfolio with Gold",
    content: "Experts recommend including gold in your investment portfolio to hedge against inflation and market volatility. Diversification is key to long-term financial stability.",
    date: "2024-04-28",
    image: "/images/news/diversify.jpg"
  },
  {
    id: "4",
    title: "Central Banks Increase Gold Reserves",
    content: "In 2024, central banks around the world have significantly increased their gold reserves. This move is seen as a response to ongoing economic uncertainty and a desire to diversify national assets. Analysts say this trend underscores gold's enduring value as a safe-haven asset and could support higher prices in the coming months.",
    date: "2024-04-10",
    image: "/images/news/central-banks.jpg"
  },
  {
    id: "5",
    title: "Gold Jewelry Demand Surges in Asia",
    content: "Gold jewelry sales have surged across Asia, especially during cultural festivals and wedding seasons. Rising incomes and a renewed appreciation for traditional gold jewelry have contributed to record demand. Retailers report that innovative designs and investment-grade pieces are especially popular among younger buyers.",
    date: "2024-03-22",
    image: "/images/news/jewelry-demand.jpg"
  },
  {
    id: "6",
    title: "Gold vs. Cryptocurrency: Which is the Better Hedge?",
    content: "As inflation and market volatility persist, investors are debating whether gold or cryptocurrencies offer better protection. While gold has a long history as a store of value, cryptocurrencies are gaining traction among younger investors. Experts suggest a balanced approach, using both assets to diversify and hedge against risk.",
    date: "2024-03-05",
    image: "/images/news/gold-vs-crypto.jpg"
  },
  {
    id: "7",
    title: "GoldMint Partners with Leading Refinery",
    content: "GoldMint has announced a new partnership with one of the world's leading gold refineries. This collaboration ensures that all GoldMint products meet the highest standards of quality and authenticity, providing investors with even greater confidence in their purchases.",
    date: "2024-02-18",
    image: "/images/news/refinery-partnership.jpg"
  },
  {
    id: "8",
    title: "Sustainable Gold Mining Practices on the Rise",
    content: "The gold mining industry is increasingly adopting sustainable practices to minimize environmental impact. Companies are investing in cleaner technologies, responsible sourcing, and community engagement. These efforts are helping to improve the industry's reputation and ensure a brighter future for gold mining.",
    date: "2024-02-01",
    image: "/images/news/sustainable-mining.jpg"
  }
];

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const news = newsItems.find(item => item.id === id);

  if (!news) {
    return (
      <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
        <div className="container-custom mx-auto text-center">
          <h1 className="text-3xl font-medium text-red-600 mb-4">{t('news.notFound', 'News article not found')}</h1>
          <Link to="/news" className="btn btn-primary">{t('news.backToList', 'Back to News')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container-custom mx-auto max-w-3xl">
        <Link to="/news" className="text-gold hover:underline mb-6 inline-block">&larr; {t('news.backToList', 'Back to News')}</Link>
        <h1 className="text-4xl font-serif font-medium text-charcoal-dark mb-4">{news.title}</h1>
        <div className="text-gray-500 mb-6">{new Date(news.date).toLocaleDateString()}</div>
        <img src={news.image} alt={news.title} className="w-full h-64 object-cover rounded-lg mb-8" />
        <div className="prose prose-lg text-gray-800">
          <p>{news.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage; 