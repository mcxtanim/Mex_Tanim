'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, User as UserIcon, LogOut, Globe, X, RotateCcw } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { CategorySidebar } from '../catalog/CategorySidebar';
import { CategoryGrid } from '../catalog/CategoryGrid';
import { ProductGrid } from '../catalog/ProductGrid';
import { PRODUCTS } from '../catalog/mockData';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const SEARCH_SUGGESTIONS_EN = [
  'Fantech 7.1 Gaming Headset',
  'Razer DeathAdder Mouse',
  'Redragon Mechanical Keyboard',
  'Baseus 65W GaN Charger',
  'PUBG Sweatproof Finger Sleeves',
  'JBL Bluetooth Soundbox',
];

const SEARCH_SUGGESTIONS_BN = [
  'ফ্যানটেক ৭.১ গেমিং হেডসেট',
  'রেজার ডেথঅ্যাডার মাউস',
  'রেড্রাগন মেকানিক্যাল কীবোর্ড',
  'বেসাস ৬৫W ফাস্ট চার্জার',
  'পাবজি ফিঙ্গার স্লিকস',
  'জেবিএল সাউন্ডবক্স',
];

const CATEGORY_META: Record<string, { en: string; bn: string; badge: string }> = {
  all: { en: 'All Products', bn: 'সকল পণ্য', badge: 'A' },
  mice: { en: 'Gaming Mice', bn: 'গেমিং মাউস', badge: 'G' },
  keyboards: { en: 'Mechanical Keyboards', bn: 'মেকানিক্যাল কীবোর্ড', badge: 'M' },
  headphones: { en: 'Gaming Headsets', bn: 'গেমিং হেডসেট', badge: 'H' },
  chargers: { en: 'Fast Chargers', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'fast-chargers': { en: 'Fast Chargers', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'finger-sleeves': { en: 'Finger Sleeves', bn: 'ফিঙ্গার স্লিকস', badge: 'S' },
  sleeves: { en: 'Finger Sleeves', bn: 'ফিঙ্গার স্লিকস', badge: 'S' },
  cables: { en: 'Cables', bn: 'केवलস', badge: 'C' },
  soundboxes: { en: 'Soundboxes', bn: 'সাউন্ডবক্স', badge: 'B' },
  soundbox: { en: 'Soundboxes', bn: 'সাউন্ডবক্স', badge: 'B' },
  trimmers: { en: 'Trimmers', bn: 'ট্রিমার', badge: 'T' },
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Keyboard listener for Escape key to close category drawer/browser
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryDrawerOpen(false);
      }
    };
    if (isCategoryDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoryDrawerOpen]);

  // Typewriter effect state for interactive search placeholder
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const suggestions = language === 'bn' ? SEARCH_SUGGESTIONS_BN : SEARCH_SUGGESTIONS_EN;
    const currentFullText = suggestions[suggestionIndex % suggestions.length];
    
    const typingSpeed = isDeleting ? 40 : 85;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentFullText) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      } else {
        const nextChar = isDeleting
          ? currentFullText.substring(0, displayText.length - 1)
          : currentFullText.substring(0, displayText.length + 1);
        setDisplayText(nextChar);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, suggestionIndex, language]);

  const animatedPlaceholder = searchQuery
    ? ''
    : language === 'bn'
    ? `খুঁজুন "${displayText}"...`
    : `Search "${displayText}"...`;

  const currentMeta = CATEGORY_META[selectedCategory] || {
    en: selectedCategory.replace('-', ' '),
    bn: selectedCategory,
    badge: selectedCategory.charAt(0).toUpperCase(),
  };

  const productCount = PRODUCTS.filter(
    (p) =>
      p.category === selectedCategory ||
      (selectedCategory === 'finger-sleeves' && p.category === 'sleeves') ||
      (selectedCategory === 'sleeves' && p.category === 'finger-sleeves') ||
      (selectedCategory === 'soundboxes' && p.category === 'soundbox') ||
      (selectedCategory === 'soundbox' && p.category === 'soundboxes') ||
      (selectedCategory === 'chargers' && p.category === 'fast-chargers') ||
      (selectedCategory === 'fast-chargers' && p.category === 'chargers')
  ).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 gap-3">
            
            {/* Left section: Circular Hamburger Menu Button (Left of Logo) + Active Category Pill + Official Large Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Round Circular Hamburger Menu Button */}
              <button
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-200/90 hover:bg-gray-300 text-black transition-all flex items-center justify-center shadow-2xs active:scale-95 border border-gray-300/50 cursor-pointer shrink-0"
                title="Product Categories"
                aria-label="Toggle Product Categories Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5]" />
                {selectedCategory !== 'all' && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Active Category Indicator Pill when selectedCategory !== 'all' */}
              {selectedCategory !== 'all' && (
                <div className="hidden sm:flex items-center space-x-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-600 px-2.5 py-1 rounded-full text-xs font-extrabold">
                  <span className="capitalize text-[11px] sm:text-xs">
                    {selectedCategory.replace('-', ' ')}
                  </span>
                  {onSelectCategory && (
                    <button
                      onClick={() => onSelectCategory('all')}
                      className="text-orange-400 hover:text-orange-700 ml-0.5 cursor-pointer"
                      title="Reset Category"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Official Mex Tanim Store Logo */}
              <a href="#" className="flex items-center cursor-pointer shrink-0 group">
                <img
                  src="/images/logo.png"
                  alt="Mex Tanim Store Logo"
                  className="h-10 sm:h-12 md:h-14 max-h-16 w-auto object-contain group-hover:scale-105 transition-all"
                />
              </a>

            </div>

            {/* Center Search Bar with Animated Typewriter Placeholder */}
            <div className="flex-1 max-w-md mx-1 sm:mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={animatedPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100/90 text-gray-800 placeholder-gray-500 font-medium pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full border border-transparent focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Official Add to Cart / Bag Icon Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-slate-900 hover:bg-orange-600 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title={t.cart}
              >
                <ShoppingBag className="w-5 h-5 sm:w-5 sm:h-5 text-orange-400 group-hover:text-white" />
                <span className="hidden md:inline-block text-xs font-bold">{t.cart}</span>
                {totalItems > 0 && (
                  <span className="bg-orange-500 text-white text-[11px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-slate-900 shadow-sm animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 bg-gray-100 py-1.5 px-3 rounded-full border border-gray-200">
                  <UserIcon className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-gray-800 hidden md:inline-block max-w-[90px] truncate">
                    {user?.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                    title={t.logout}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => openAuthModal('register')}
                    className="hidden sm:inline-flex px-3 py-2 text-xs font-bold text-slate-800 hover:text-orange-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
                  >
                    {t.register}
                  </button>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    {t.login}
                  </button>
                </div>
              )}

              {/* LANGUAGE TOGGLE BUTTON */}
              <div className="pl-1 border-l border-gray-200">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2.5 py-1.5 rounded-full text-xs font-extrabold text-slate-800 transition active:scale-95 cursor-pointer"
                  title="Switch Language / ভাষা পরিবর্তন করুন"
                >
                  <Globe className="w-3.5 h-3.5 text-orange-500" />
                  <span className={language === 'en' ? 'text-orange-600 font-black' : 'text-gray-500 font-semibold'}>EN</span>
                  <span className="text-gray-300">|</span>
                  <span className={language === 'bn' ? 'text-orange-600 font-black' : 'text-gray-500 font-semibold'}>বাংলা</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* Persistent Two-Pane Category Browser Overlay */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-0 sm:p-4">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsCategoryDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Persistent Two-Pane Modal/Drawer Container */}
          <div className="relative z-10 w-full h-full sm:h-[90vh] max-w-7xl bg-slate-900 text-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Overlay Header Bar */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-6 bg-orange-500 rounded-full inline-block shadow-sm"></span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                  {language === 'bn' ? 'ক্যাটাগরি ব্রাউজার' : 'Category Browser'}
                </h2>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Home Page Navigation Button */}
                <button
                  onClick={() => {
                    setIsCategoryDrawerOpen(false);
                    if (onSelectCategory) onSelectCategory('all');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm flex items-center space-x-1.5 transition active:scale-95 shadow-md cursor-pointer border border-orange-400/40"
                  title="Go to Homepage"
                >
                  <span className="text-sm">🏠</span>
                  <span>{language === 'bn' ? 'হোম পেজ' : 'Home Page'}</span>
                </button>

                <button
                  onClick={() => setIsCategoryDrawerOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-95 cursor-pointer"
                  aria-label="Close browser"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Two-Pane Content Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              
              {/* Left Pane: Category Navigation List */}
              <div className="overflow-y-auto h-full w-full md:w-80 shrink-0 p-4 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/40">
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    if (onSelectCategory) {
                      onSelectCategory(cat);
                    }
                  }}
                />
              </div>

              {/* Right Pane: Category Content / Product Area */}
              <div className="overflow-y-auto h-full flex-1 p-4 sm:p-6 bg-slate-950/20 text-slate-100">
                {selectedCategory === 'all' ? (
                  <div className="space-y-6">
                    <CategoryGrid
                      selectedCategory={selectedCategory}
                      onSelectCategory={(cat) => {
                        if (onSelectCategory) onSelectCategory(cat);
                      }}
                      onCloseBrowser={() => setIsCategoryDrawerOpen(false)}
                    />
                    <ProductGrid
                      selectedCategory={selectedCategory}
                      searchQuery={searchQuery}
                      onSelectCategory={(cat) => {
                        if (onSelectCategory) onSelectCategory(cat);
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Category Header Bar */}
                    <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700/60">
                      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="flex items-center space-x-4 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-black text-xl shrink-0">
                          {currentMeta.badge}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">
                              {language === 'bn' ? 'ক্যাটাগরি ভিউ' : 'Category View'}
                            </span>
                            <span className="bg-orange-500/20 text-orange-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-orange-500/30">
                              {productCount} {language === 'bn' ? 'টি পণ্য' : 'products'}
                            </span>
                          </div>
                          <h1 className="text-xl sm:text-2xl font-black text-white capitalize mt-0.5">
                            {language === 'bn' ? currentMeta.bn : currentMeta.en}
                          </h1>
                        </div>
                      </div>

                      {onSelectCategory && (
                        <button
                          onClick={() => onSelectCategory('all')}
                          className="relative z-10 self-start sm:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-orange-500/50 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 active:scale-95 shadow-sm cursor-pointer"
                        >
                          <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}</span>
                          <RotateCcw className="w-4 h-4 text-orange-400" />
                        </button>
                      )}
                    </div>

                    {/* Product Grid */}
                    <ProductGrid
                      selectedCategory={selectedCategory}
                      searchQuery={searchQuery}
                      onSelectCategory={(cat) => {
                        if (onSelectCategory) onSelectCategory(cat);
                      }}
                    />
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
