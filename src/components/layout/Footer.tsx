import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-charcoal-dark text-gray-300">
      <div className="container-custom mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm">
              {t('footer.company.description')}
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">{t('footer.quickLinks.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.quickLinks.about')}
                </Link>
              </li>
              <li>
                <Link to="/gold-prices" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.quickLinks.goldPrices')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.quickLinks.contact')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.quickLinks.blog')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-medium mb-4">{t('footer.customerService.title')}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.customerService.faq')}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.customerService.shipping')}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.customerService.returns')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.customerService.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.customerService.terms')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-medium mb-4">{t('footer.contact.title')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+1234567890" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.contact.phone')}
                </a>
              </li>
              <li>
                <a href="mailto:info@goldmint.com" className="text-gray-300 hover:text-gold transition-colors">
                  {t('footer.contact.email')}
                </a>
              </li>
              <li className="text-gray-300">
                {t('footer.contact.address')}
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-gray-700 pt-8 pb-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h4 className="text-lg font-medium mb-2">Subscribe to our Newsletter</h4>
              <p className="text-gray-400 text-sm">
                Stay updated with the latest products, promotions, and gold market insights.
              </p>
            </div>
            <div className="md:w-1/2">
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-l-md text-charcoal-dark focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gold text-white px-4 py-2 rounded-r-md hover:bg-gold-dark transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} GoldMint. {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                {t('footer.social.facebook')}
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                {t('footer.social.twitter')}
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                {t('footer.social.instagram')}
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                {t('footer.social.linkedin')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;