'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, User as UserIcon, X, LogOut, Globe } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { CategorySidebar } from '../catalog/CategorySidebar';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  selectedCategory?: string;
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

const CATEGORY_MAP: Record<string, { en: string; bn: string }> = {
  mice: { en: 'GAMING MICE', bn: 'গেমিং মাউস' },
  keyboards: { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কীবোর্ড' },
  headphones: { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট' },
  chargers: { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার' },
  'finger-sleeves': { en: 'FINGER SLEEVES', bn: 'ফিঙ্গার স্লিকস' },
  sleeves: { en: 'FINGER SLEEVES', bn: 'ফিঙ্গার স্লিকস' },
  cables: { en: 'CABLES', bn: 'কেবলস' },
  soundboxes: { en: 'SOUNDBOXES', bn: 'সাউন্ডবক্স' },
  soundbox: { en: 'SOUNDBOXES', bn: 'সাউন্ডবক্স' },
  trimmers: { en: 'TRIMMERS', bn: 'ট্রিমার' },
};

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  selectedCategory = 'all',
}) => {
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs transition-all">
      <div className="w-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-3">
          
          {/* Left section: Circular Hamburger Menu Button (Left of Logo) + Active Category Badge + Official Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Round Circular Hamburger Menu Button */}
            <button
              onClick={() => setIsCategoryMenuOpen(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-200/90 hover:bg-gray-300 text-black transition-all flex items-center justify-center shadow-2xs active:scale-95 border border-gray-300/50 cursor-pointer shrink-0"
              title="Product Categories"
              aria-label="Toggle Product Categories Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5]" />
            </button>

            {/* Active Category Badge & Reset Button */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center space-x-1.5 bg-orange-100/90 border border-orange-300 text-orange-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs shrink-0 animate-in fade-in duration-200">
                <span className="truncate max-w-[90px] sm:max-w-[130px] uppercase tracking-wide">
                  {language === 'bn'
                    ? CATEGORY_MAP[selectedCategory]?.bn || selectedCategory
                    : CATEGORY_MAP[selectedCategory]?.en || selectedCategory}
                </span>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('all')}
                  className="ml-1 text-xs text-orange-700 hover:text-white bg-orange-200 hover:bg-orange-600 px-1.5 py-0.5 rounded-full font-bold cursor-pointer transition-all flex items-center gap-1"
                  title={language === 'bn' ? 'রিসেট' : 'Reset'}
                  aria-label="Reset Category Filter"
                >
                  <X className="w-3 h-3 stroke-[3]" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
                </button>
              </div>
            )}

            {/* Official Mex Tanim Store Logo */}
            <a href="#" className="flex items-center justify-center cursor-pointer shrink-0 group">
              <img
                src="/images/logo.png"
                alt="Mex Tanim Store Logo"
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[150px] sm:max-w-[200px] object-contain group-hover:scale-105 transition-all"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center"
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

      {/* Full Slide-Over Left Drawer / Overlay for Categories */}
      {isCategoryMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsCategoryMenuOpen(false)}
          />

          {/* Drawer content sliding from left */}
          <div className="relative z-10 w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300 p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 shrink-0">
              <a href="#" onClick={() => setIsCategoryMenuOpen(false)}>
                <img
                  src="/images/logo.png"
                  alt="Mex Tanim Store Logo"
                  className="h-8 w-auto object-contain"
                />
              </a>
              <button
                onClick={() => setIsCategoryMenuOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
                aria-label="Close categories menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  if (onSelectCategory) {
                    onSelectCategory(category);
                  }
                  setIsCategoryMenuOpen(false);
                }}
                onCloseMobile={() => setIsCategoryMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
