'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ShoppingBag, Globe, X, RotateCcw, Package, Layers, ChevronRight, ArrowRight, LayoutGrid } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from './LanguageContext';
import { CategorySidebar } from '../catalog/CategorySidebar';
import { CategoryItem, fetchLiveCategories, getCachedCategories } from '../catalog/categoryData';
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
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    // 1. Client-side cache hydration (prevents SSR hydration mismatch)
    const cached = getCachedCategories();
    if (cached.length > 0) {
      setCategories(cached);
    }

    const loadCategories = async () => {
      const liveCats = await fetchLiveCategories();
      setCategories(liveCats);
    };
    loadCategories();

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        loadCategories();
      }
    };

    window.addEventListener('categories_updated', handleCategoriesUpdate);
    window.addEventListener('storage', loadCategories);
    return () => {
      window.removeEventListener('categories_updated', handleCategoriesUpdate);
      window.removeEventListener('storage', loadCategories);
    };
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

  const animatedPlaceholder = searchQuery
    ? ''
    : language === 'bn'
    ? 'পণ্য খুঁজুন...'
    : 'Search products...';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs transition-all">
        {settings.showAnnouncement && (settings.announcementBn || settings.announcementEn) && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white text-[11px] sm:text-xs font-medium py-1.5 px-4 text-center border-b border-white/10 flex items-center justify-center space-x-2">
            <span className="text-orange-400 font-bold">📢</span>
            <span className="truncate max-w-4xl font-semibold tracking-wide">
              {language === 'bn' ? settings.announcementBn : settings.announcementEn}
            </span>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop & Tablet Layout (sm and up) - Matching Hunter Reference Style */}
          <div className="hidden sm:flex items-center justify-between h-20 sm:h-22 gap-3 md:gap-4">
            
            {/* Left section: Left Hamburger Button + Mex Tanim Logo */}
            <div className="flex items-center space-x-3 shrink-0">
              
              {/* Round Circular Hamburger Menu Button */}
              <button
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-900 transition-all flex items-center justify-center border border-gray-200/80 shadow-2xs active:scale-95 cursor-pointer shrink-0"
                title="Product Categories"
                aria-label="Toggle Product Categories Drawer"
              >
                <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-900 stroke-[2.5]" />
                {selectedCategory !== 'all' && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Active Category Indicator Pill when selectedCategory !== 'all' */}
              {selectedCategory !== 'all' && (
                <div className="hidden md:flex items-center space-x-1.5 bg-orange-500/15 backdrop-blur-md border border-orange-500/30 text-orange-600 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-xs">
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
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain group-hover:scale-102 transition-all drop-shadow-xs"
                />
              </Link>
            </div>

            {/* Center Search Bar: Large Centered Pill with Black Search Button (Hunter Reference) */}
            <div className="flex-1 max-w-xl lg:max-w-2xl mx-2 sm:mx-6">
              <div className="relative flex items-center w-full bg-gray-50/90 hover:bg-white focus-within:bg-white rounded-full border border-gray-200/90 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shadow-inner">
                <Search className="w-4 h-4 text-gray-400 ml-4 shrink-0" />
                <input
                  type="text"
                  placeholder={animatedPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium pl-3 pr-20 py-2.5 sm:py-3 text-xs sm:text-sm outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery?.('')}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200/80 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                )}
                {/* Black Circle Search Action Button */}
                <button
                  type="button"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 bg-black hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs shrink-0"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-white stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Right Action Buttons: Cart, Orders, Language (NO Login / Register) */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              
              {/* My Orders Button */}
              <Link
                href="/orders"
                prefetch={false}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-800 border border-gray-200/80 shadow-2xs transition flex items-center justify-center cursor-pointer shrink-0"
                title={language === 'bn' ? 'আমার অর্ডার ও ট্র্যাকিং' : 'My Orders & Tracking'}
              >
                <Package className="w-5 h-5 text-slate-800" />
              </Link>

              {/* Hunter Style Round Cart Icon with Black Badge */}
              <Link
                href="/cart"
                prefetch={false}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-900 border border-gray-200/80 shadow-2xs transition flex items-center justify-center active:scale-95 cursor-pointer shrink-0"
                title={t.cart}
              >
                <ShoppingBag className="w-5 h-5 text-slate-900" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* LANGUAGE TOGGLE BUTTON */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center space-x-1 bg-gray-100/90 hover:bg-gray-200 border border-gray-200/80 px-2.5 py-2 rounded-full text-xs font-extrabold text-slate-800 transition active:scale-95 cursor-pointer shadow-2xs shrink-0"
                title="Switch Language / ভাষা পরিবর্তন করুন"
              >
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span className={language === 'en' ? 'text-black font-black' : 'text-gray-400'}>EN</span>
                <span className="text-gray-300">|</span>
                <span className={language === 'bn' ? 'text-black font-black' : 'text-gray-400'}>বাং</span>
              </button>

            </div>
          </div>

          {/* Dedicated Mobile Layout (< sm): Clean 2-Row Layout */}
          <div className="sm:hidden py-2.5 space-y-2.5">
            {/* Mobile Row 1: Left Menu + Logo, Right Actions */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center space-x-2 shrink-0">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsCategoryDrawerOpen(true)}
                  className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center border border-gray-200 shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                  title="Product Categories"
                  aria-label="Toggle Product Categories Drawer"
                >
                  <Menu className="w-5 h-5 text-black stroke-[2.5]" />
                  {selectedCategory !== 'all' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>

                {/* Mobile Logo */}
                <Link href="/" className="flex items-center shrink-0">
                  <img
                    src="/images/logo.png"
                    alt="Mex Tanim Store Logo"
                    className="h-9 w-auto max-w-[130px] object-contain drop-shadow-xs"
                  />
                </Link>
              </div>

              {/* Mobile Right Action Icons */}
              <div className="flex items-center space-x-1.5 shrink-0">
                {/* Mobile Language Switcher */}
                <button
                  onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                  className="flex items-center space-x-0.5 bg-gray-100 border border-gray-200 px-2 py-1.5 rounded-full text-[10px] font-bold text-slate-800 transition active:scale-95 cursor-pointer shadow-2xs"
                  title="Switch Language / ভাষা পরিবর্তন করুন"
                >
                  <Globe className="w-3 h-3 text-slate-600 shrink-0" />
                  <span className={language === 'en' ? 'text-black font-black' : 'text-gray-400'}>EN</span>
                  <span className="text-gray-300">|</span>
                  <span className={language === 'bn' ? 'text-black font-black' : 'text-gray-400'}>বাং</span>
                </button>

                {/* Mobile Orders Link */}
                <Link
                  href="/orders"
                  prefetch={false}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-800 border border-gray-200 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                  title={language === 'bn' ? 'আমার অর্ডার' : 'My Orders'}
                >
                  <Package className="w-4 h-4 text-slate-800" />
                </Link>

                {/* Mobile Cart Link with Black Badge */}
                <Link
                  href="/cart"
                  prefetch={false}
                  className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-black border border-gray-200 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
                  title={t.cart}
                >
                  <ShoppingBag className="w-4 h-4 text-black" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-0.5 flex items-center justify-center border border-white shadow-xs">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Row 2: Full-Width Search Pill with Black Search Button */}
            <div className="relative flex items-center w-full bg-gray-50/90 rounded-full border border-gray-200/90 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shadow-inner">
              <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0" />
              <input
                type="text"
                placeholder={animatedPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium pl-2.5 pr-16 py-2 text-xs outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery?.('')}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              )}
              <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs shrink-0"
                title="Search"
              >
                <Search className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </button>
            </div>

            {/* Mobile Active Category Pill (if a category is active) */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center justify-between bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl text-xs text-orange-700 font-bold">
                <span className="capitalize text-[11px] truncate">
                  {language === 'bn' ? 'ক্যাটাগরি: ' : 'Category: '}
                  {selectedCategory.replace('-', ' ')}
                </span>
                {onSelectCategory && (
                  <button
                    onClick={() => onSelectCategory('all')}
                    className="text-orange-600 hover:text-orange-800 text-[11px] font-extrabold flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
                  >
                    <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
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
