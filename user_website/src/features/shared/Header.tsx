'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ShoppingBag, Globe, X, RotateCcw, Package, Layers, ChevronRight, ArrowRight, LayoutGrid } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { CategorySidebar } from '../catalog/CategorySidebar';
import { CATEGORIES, CategoryItem, fetchLiveCategories } from '../catalog/categoryData';
import { useStoreSettings } from './storeSettingsService';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
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
  searchQuery = '',
  setSearchQuery,
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const { totalItems, openCart } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const settings = useStoreSettings();
  const router = useRouter();

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);

  useEffect(() => {
    const loadCategories = async () => {
      const liveCats = await fetchLiveCategories();
      setCategories(liveCats);
    };
    loadCategories();

    window.addEventListener('storage', loadCategories);
    return () => window.removeEventListener('storage', loadCategories);
  }, []);

  // Keyboard listener for Escape key to close left category drawer
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
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/40 shadow-xs transition-all">
        {settings.showAnnouncement && (settings.announcementBn || settings.announcementEn) && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-[11px] sm:text-xs font-medium py-1.5 px-4 text-center border-b border-white/10 flex items-center justify-center space-x-2">
            <span className="text-orange-400 font-bold">📢</span>
            <span className="truncate max-w-4xl font-semibold tracking-wide">
              {language === 'bn' ? settings.announcementBn : settings.announcementEn}
            </span>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 gap-3">
            
            {/* Left section: Left Hamburger Button + Active Category Pill + Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Round Circular Hamburger Menu Button (Appears Slide-Out Category Drawer from Left) */}
              <button
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-200/80 backdrop-blur-md hover:bg-gray-300/90 text-black transition-all flex items-center justify-center shadow-2xs active:scale-95 border border-white/60 cursor-pointer shrink-0"
                title="Product Categories"
                aria-label="Toggle Product Categories Drawer"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-black stroke-[2.5]" />
                {selectedCategory !== 'all' && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Active Category Indicator Pill when selectedCategory !== 'all' */}
              {selectedCategory !== 'all' && (
                <div className="hidden sm:flex items-center space-x-1.5 bg-orange-500/15 backdrop-blur-md border border-orange-500/30 text-orange-600 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-xs">
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
              <Link href="/" className="flex items-center cursor-pointer shrink-0 group">
                <img
                  src="/images/logo.png"
                  alt="Mex Tanim Store Logo"
                  className="h-14 sm:h-16 md:h-20 max-h-24 sm:max-h-28 w-auto object-contain group-hover:scale-105 transition-all drop-shadow-xs"
                />
              </Link>
            </div>

            {/* Center Search Bar with Animated Typewriter Placeholder */}
            <div className="flex-1 max-w-md mx-1 sm:mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={animatedPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  className="w-full bg-gray-100/80 backdrop-blur-md text-gray-800 placeholder-gray-500 font-medium pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full border border-white/50 focus:border-orange-500 focus:bg-white/90 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery?.('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200/80 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Dedicated Category Page Link */}
              <Link
                href="/categories"
                className="hidden lg:flex items-center space-x-1.5 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 border border-orange-500/30 rounded-xl text-xs font-extrabold transition cursor-pointer"
                title="View Category Catalog"
              >
                <Layers className="w-4 h-4 text-orange-500" />
                <span>{language === 'bn' ? 'ক্যাটাগরি পেজ' : 'Categories'}</span>
              </Link>

              {/* My Orders Button */}
              <Link
                href="/orders"
                className="p-2 sm:px-3 sm:py-2 bg-white/80 backdrop-blur-md hover:bg-slate-900 hover:text-white text-slate-800 rounded-xl border border-white/60 shadow-2xs transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer font-extrabold text-xs shrink-0"
                title={language === 'bn' ? 'আমার অর্ডার ও ট্র্যাকিং' : 'My Orders & Tracking'}
              >
                <Package className="w-4 h-4 text-orange-500" />
                <span className="hidden sm:inline-block">
                  {language === 'bn' ? 'আমার অর্ডার' : 'My Orders'}
                </span>
              </Link>

              {/* Official Add to Cart / Bag Icon Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 bg-slate-900/90 hover:bg-orange-600/90 backdrop-blur-md text-white rounded-xl shadow-md border border-white/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
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

              {/* LANGUAGE TOGGLE BUTTON */}
              <div className="pl-1 border-l border-gray-200/60">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="flex items-center space-x-1 bg-gray-100/80 backdrop-blur-md hover:bg-gray-200/90 border border-white/50 px-2.5 py-1.5 rounded-full text-xs font-extrabold text-slate-800 transition active:scale-95 cursor-pointer shadow-2xs"
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

      {/* Left Slide-Out Category Drawer Overlay (Matching Reference Image 1) */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsCategoryDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Left Slide-Out Drawer Panel */}
          <div className="relative z-10 w-80 sm:w-96 h-full bg-white text-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
            
            {/* Black Drawer Header (Matching Image 1) */}
            <div className="px-5 py-4 bg-black text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base leading-tight">
                    {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {categories.length}{language === 'bn' ? 'টি কালেকশন' : ' Collections'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer"
                aria-label="Close category drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* White Drawer Navigation List (Matching Image 1) */}
            <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => {
                  if (onSelectCategory) {
                    onSelectCategory(catId);
                  }
                  setIsCategoryDrawerOpen(false);
                  router.push(`/categories?cat=${catId}`);
                }}
              />
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-gray-100 bg-slate-50 text-center text-xs font-semibold text-slate-500 shrink-0">
              Mex Tanim Store • 100% Authentic Gadgets
            </div>
          </div>
        </div>
      )}
    </>
  );
};
