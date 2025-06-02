import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Luggage as GoldNugget, CreditCard, Heart, LogOut, ShoppingBag, Clock, ArrowUp, ArrowDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../ui/Logo';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [goldDropdownOpen, setGoldDropdownOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const goldDropdownTimer = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Languages configuration
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when changing routes
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Focus search input when search is opened
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchOpen) return;

      if (e.key === 'Escape') {
        setSearchOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < recentSearches.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > -1 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedSuggestionIndex > -1) {
        e.preventDefault();
        const selectedQuery = recentSearches[selectedSuggestionIndex];
        setSearchQuery(selectedQuery);
        handleSearch(selectedQuery);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, recentSearches, selectedSuggestionIndex]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      setSearchOpen(false);
      setUserMenuOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (!userMenuOpen) {
      setMobileMenuOpen(false);
      setSearchOpen(false);
    }
  };

  const toggleLanguageMenu = () => {
    setLanguageMenuOpen(!languageMenuOpen);
    if (!languageMenuOpen) {
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      setSearchOpen(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      // TODO: Implement actual search functionality
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
      saveRecentSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleLanguageSelect = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setLanguageMenuOpen(false);
  };

  const menu = [
    {
      name: 'Gold',
      translationKey: 'gold',
      dropdown: [
        { name: 'Gold Bars', translationKey: 'goldBars', path: '/category/bars' },
        { name: 'Gold Coins', translationKey: 'goldCoins', path: '/category/coins' },
        { name: 'Jewelry', translationKey: 'jewelry', path: '/category/jewelry' },
      ],
    },
    { name: 'Silver', translationKey: 'silver', path: '/category/silver' },
    { name: 'Platinum & Palladium', translationKey: 'platinumPalladium', path: '/category/platinum-palladium' },
    { name: 'Gold Prices', translationKey: 'goldPrices', path: '/gold-prices' },
    { name: 'About Us', translationKey: 'aboutUs', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo isScrolled={isScrolled} />
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Gold Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (goldDropdownTimer.current) clearTimeout(goldDropdownTimer.current);
                goldDropdownTimer.current = setTimeout(() => setGoldDropdownOpen(true), 150);
              }}
              onMouseLeave={() => {
                if (goldDropdownTimer.current) clearTimeout(goldDropdownTimer.current);
                goldDropdownTimer.current = setTimeout(() => setGoldDropdownOpen(false), 200);
              }}
            >
              <button
                className={`flex items-center text-sm font-medium transition-colors duration-200 hover:text-gold ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`}
              >
                {t(`header.menu.${menu[0].translationKey}`)} <ChevronDown size={16} className="ml-1" />
              </button>
              {goldDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-elegant py-2 z-20">
                  {menu[0].dropdown?.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path || ''}
                      className="block px-4 py-2 text-sm text-charcoal hover:bg-gray-50 hover:text-gold"
                    >
                      {t(`header.menu.${item.translationKey}`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Other menu items */}
            {menu.slice(1).map((item, idx) => (
              <Link
                key={idx}
                to={item.path || ''}
                className={`text-sm font-medium transition-colors duration-200 hover:text-gold ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`}
              >
                {t(`header.menu.${item.translationKey}`)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button 
                onClick={toggleLanguageMenu}
                className={`p-2 rounded-full transition-colors
                  ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                aria-label="Select Language"
              >
                <Globe 
                  size={20} 
                  className={`transition-colors ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} 
                />
              </button>
              
              {/* Language Dropdown Menu */}
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-elegant py-2 z-10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`flex items-center w-full px-4 py-2 text-sm text-charcoal hover:bg-gray-50 hover:text-gold transition-colors ${
                        i18n.language === lang.code ? 'bg-gray-50 text-gold' : ''
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button 
              onClick={toggleSearch}
              className={`p-2 rounded-full transition-colors
                ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              aria-label="Search"
            >
              <Search 
                size={20} 
                className={`transition-colors ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} 
              />
            </button>
            
            {/* User Account */}
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className={`p-2 rounded-full transition-colors
                  ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                aria-label="Account"
              >
                <User 
                  size={20} 
                  className={`transition-colors ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} 
                />
              </button>
              
              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-elegant py-2 z-10">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-charcoal">{(user as any)?.name || ''}</p>
                        <p className="text-xs text-gray-500">{user?.email || ''}</p>
                      </div>
                      <Link to="/account" className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-gray-50">
                        <User size={16} className="mr-2" />
                        {t('header.user.myAccount')}
                      </Link>
                      <Link to="/account/orders" className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-gray-50">
                        <ShoppingBag size={16} className="mr-2" />
                        {t('header.user.myOrders')}
                      </Link>
                      <Link to="/account/wishlist" className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-gray-50">
                        <Heart size={16} className="mr-2" />
                        {t('header.user.wishlist')}
                      </Link>
                      <button 
                        onClick={logout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut size={16} className="mr-2" />
                        {t('header.user.logOut')}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/account/login" className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-gray-50">
                        <User size={16} className="mr-2" />
                        {t('header.user.signIn')}
                      </Link>
                      <Link to="/account/register" className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-gray-50">
                        <CreditCard size={16} className="mr-2" />
                        {t('header.user.createAccount')}
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link to="/account/orders" className="flex items-center px-4 py-2 text-sm text-charcoal hover:bg-gray-50">
                        <ShoppingBag size={16} className="mr-2" />
                        {t('header.user.trackOrder')}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
            
            {/* Cart */}
            <Link 
              to="/cart" 
              className={`p-2 rounded-full transition-colors relative
                ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              aria-label="Cart"
            >
              <ShoppingCart 
                size={20} 
                className={`transition-colors ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} 
              />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-gold text-white text-xxs w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-full transition-colors
                ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X 
                  size={20} 
                  className={`transition-colors ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} 
                />
              ) : (
                <Menu 
                  size={20} 
                  className={`transition-colors ${isScrolled ? 'text-charcoal' : 'text-charcoal'}`} 
                />
              )}
            </button>
          </div>
        </div>
        
        {/* Search Overlay */}
        {searchOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setSearchOpen(false)}
            />
            <div className="absolute left-0 right-0 bg-white shadow-md p-4 mt-2 z-50 animate-fadeIn">
              <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold">
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('header.search.placeholder')}
                    className="w-full p-3 bg-transparent border-none focus:outline-none text-charcoal placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="p-3 text-charcoal hover:text-gold transition-colors disabled:opacity-50"
                    aria-label="Search"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search size={20} />
                    )}
                  </button>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock size={16} className="mr-2" />
                      {t('header.search.recentSearches')}
                    </div>
                    <ul className="space-y-1">
                      {recentSearches.map((suggestion, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className={`w-full flex items-center justify-between p-2 rounded-md text-sm text-charcoal hover:bg-gray-50 transition-colors ${
                              selectedSuggestionIndex === index ? 'bg-gray-50' : ''
                            }`}
                          >
                            <span className="flex items-center">
                              <Search size={16} className="mr-2 text-gray-400" />
                              {suggestion}
                            </span>
                            {selectedSuggestionIndex === index && (
                              <span className="text-xs text-gray-400">
                                {t('header.search.select')}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyboard Navigation Help */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <ArrowUp size={16} className="mr-1" />
                      <ArrowDown size={16} className="mr-1" />
                      {t('header.search.navigate')}
                    </span>
                    <span>{t('header.search.select')}</span>
                  </div>
                  <span>{t('header.search.close')}</span>
                </div>
              </form>
            </div>
          </>
        )}
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden absolute left-0 right-0 bg-white shadow-md mt-2 py-4 px-6 z-20">
            <ul className="space-y-4">
              {/* Gold Dropdown (collapsible) */}
              <li>
                <button
                  className="flex items-center w-full justify-between py-2 text-charcoal hover:text-gold transition-colors"
                  onClick={() => setGoldDropdownOpen((open) => !open)}
                >
                  {t(`header.menu.${menu[0].translationKey}`)} <ChevronDown size={16} className={`ml-1 transition-transform ${goldDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {goldDropdownOpen && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {menu[0].dropdown?.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={item.path || ''}
                          className="block py-2 text-charcoal hover:text-gold transition-colors"
                        >
                          {t(`header.menu.${item.translationKey}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {/* Other menu items */}
              {menu.slice(1).map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path || ''}
                    className="block py-2 text-charcoal hover:text-gold transition-colors"
                  >
                    {t(`header.menu.${item.translationKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;