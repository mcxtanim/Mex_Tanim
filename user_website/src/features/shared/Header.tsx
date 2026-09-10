'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, User as UserIcon, LogOut, Globe, X } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { CategorySidebar } from '../catalog/CategorySidebar';

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

  // Keyboard listener for Escape key to close category drawer
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

      {/* Category Navigation Slide-out Drawer */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsCategoryDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Left Slide-out Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-slate-900/95 backdrop-blur-2xl text-white shadow-2xl h-full flex flex-col z-10 border-r border-slate-800/80 animate-in slide-in-from-left duration-300">
            
            {/* Drawer Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block shadow-sm"></span>
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  {language === 'bn' ? 'ব্রাউজ ক্যাটাগরি' : 'Category Drawer'}
                </h2>
              </div>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-full transition active:scale-95 cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  if (onSelectCategory) {
                    onSelectCategory(cat);
                  }
                  setIsCategoryDrawerOpen(false);
                }}
                onCloseMobile={() => setIsCategoryDrawerOpen(false)}
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
};

