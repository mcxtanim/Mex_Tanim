'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User as UserIcon, LogOut, Globe, MoreVertical, X } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [is3DotMenuOpen, setIs3DotMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-3">
          
          {/* Left section: Official Large Image Logo + 3-Dot Navbar Button (Side-by-side) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Official Mex Tanim Store Logo (Increased height so text & slogan are perfectly readable) */}
            <a href="#" className="flex items-center cursor-pointer shrink-0">
              <img
                src="/images/logo.png"
                alt="Mex Tanim Store Logo"
                className="h-12 sm:h-16 md:h-18 max-h-20 w-auto object-contain hover:scale-105 transition-all"
              />
            </a>

            {/* 3-Dot Navbar Button (Positioned side-by-side right next to the logo) */}
            <div className="relative">
              <button
                onClick={() => setIs3DotMenuOpen(!is3DotMenuOpen)}
                className="p-2 sm:p-2.5 text-slate-800 hover:text-orange-500 hover:bg-orange-50 rounded-xl border border-gray-200 transition-all flex items-center justify-center shadow-2xs active:scale-95"
                title="Navigation Menu"
                aria-label="Toggle 3-dot menu"
              >
                {is3DotMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

              {/* 3-Dot Navbar Popup Menu */}
              {is3DotMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <a
                    href="#hero"
                    onClick={() => setIs3DotMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                  >
                    <span>🏠 Home</span>
                  </a>
                  <a
                    href="#categories"
                    onClick={() => setIs3DotMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                  >
                    <span>📦 {t.categoriesTitle}</span>
                  </a>
                  <a
                    href="#products"
                    onClick={() => setIs3DotMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                  >
                    <span>🔥 {t.featuredProducts}</span>
                  </a>
                  <a
                    href="#app-install"
                    onClick={() => setIs3DotMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition"
                  >
                    <span>📱 {t.appInstallBtn}</span>
                  </a>
                </div>
              )}
            </div>

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
              className="relative p-2.5 bg-slate-900 hover:bg-orange-600 text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
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
                  className="text-gray-400 hover:text-red-500 transition p-1"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => openAuthModal('register')}
                  className="hidden sm:inline-flex px-3 py-2 text-xs font-bold text-slate-800 hover:text-orange-600 rounded-full hover:bg-gray-100 transition"
                >
                  {t.register}
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full shadow-sm transition active:scale-95"
                >
                  {t.login}
                </button>
              </div>
            )}

            {/* LANGUAGE TOGGLE BUTTON */}
            <div className="pl-1 border-l border-gray-200">
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-2.5 py-1.5 rounded-full text-xs font-extrabold text-slate-800 transition active:scale-95"
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
  );
};
