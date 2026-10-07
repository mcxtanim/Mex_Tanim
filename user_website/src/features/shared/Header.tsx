'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ShoppingCart, Globe, X, RotateCcw, Package, Layers, ChevronRight, ArrowRight, LayoutGrid } from 'lucide-react';
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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim() && typeof window !== 'undefined' && window.location.pathname !== '/') {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
          {/* Desktop & Tablet Layout (sm and up) - Balanced Header with 1.5x Prominent Logo & Compact Controls */}
          <div className="hidden sm:flex items-center justify-between h-20 sm:h-24 md:h-26 gap-3 md:gap-4">
            
            {/* Left section: Left Hamburger Button + Prominent Mex Tanim Logo */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
              
              {/* Compact Circular Hamburger Menu Button */}
              <button
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200/90 text-slate-800 transition-all flex items-center justify-center border border-gray-200/70 shadow-2xs active:scale-95 cursor-pointer shrink-0"
                title="Product Categories"
                aria-label="Toggle Product Categories Drawer"
              >
                <Menu className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-800 stroke-[2.2]" />
                {selectedCategory !== 'all' && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
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

              {/* Official Mex Tanim Store Logo (1.5x Larger, crisp presentation) */}
              <Link href="/" className="flex items-center cursor-pointer shrink-0 group py-1">
                <img
                  src="/images/logo.png"
                  alt="Mex Tanim Store Logo"
                  className="h-14 sm:h-18 md:h-20 lg:h-22 w-auto max-h-24 object-contain group-hover:scale-102 transition-all drop-shadow-sm"
                />
              </Link>
            </div>

            {/* Center Search Bar: Styled identically to Reference Image 2 */}
            <div className="flex-1 max-w-lg md:max-w-xl lg:max-w-2xl mx-3 sm:mx-6 lg:mx-8">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center w-full bg-[#f1f3f5] hover:bg-gray-200/70 focus-within:bg-white rounded-full border border-gray-200/90 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shadow-inner h-10 sm:h-11 md:h-12"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400 ml-3.5 sm:ml-4.5 shrink-0 stroke-[2]" />
                <input
                  type="text"
                  placeholder={animatedPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  className="w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium pl-2.5 sm:pl-3 pr-14 sm:pr-16 py-2 text-xs sm:text-sm outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery?.('')}
                    className="absolute right-12 sm:right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200/80 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    ×
                  </button>
                )}
                {/* Black Squircle Search Action Button (Matching Reference Image 2) */}
                <button
                  type="submit"
                  className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 md:w-9.5 md:h-9.5 bg-black hover:bg-slate-900 text-white rounded-xl sm:rounded-2xl flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs shrink-0"
                  title="Search"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
                </button>
              </form>
            </div>

            {/* Right Action Controls: Matching Reference Image 2 (ONLY Circular Cart with Black Badge) */}
            <div className="flex items-center shrink-0">
              <Link
                href="/cart"
                prefetch={false}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#e9ecef] hover:bg-[#dee2e6] text-slate-900 transition flex items-center justify-center active:scale-95 cursor-pointer shrink-0 shadow-2xs"
                title={t.cart}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-900 stroke-[2.2]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] sm:text-[11px] font-black rounded-full h-4.5 min-w-[18px] sm:h-5 sm:min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Dedicated Mobile Layout (< sm): Clean 2-Row Layout Matching Reference */}
          <div className="sm:hidden py-2.5 space-y-2.5">
            {/* Mobile Row 1: Left Hamburger + Logo, Right Cart (Matching Reference Image 2) */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center space-x-2 shrink-0">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsCategoryDrawerOpen(true)}
                  className="relative w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-black flex items-center justify-center border border-gray-200 shadow-2xs active:scale-95 shrink-0 cursor-pointer"
                  title="Product Categories"
                  aria-label="Toggle Product Categories Drawer"
                >
                  <Menu className="w-4.5 h-4.5 text-black stroke-[2.2]" />
                  {selectedCategory !== 'all' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>

                {/* Mobile Logo (1.5x larger) */}
                <Link href="/" className="flex items-center shrink-0">
                  <img
                    src="/images/logo.png"
                    alt="Mex Tanim Store Logo"
                    className="h-13 sm:h-15 w-auto max-w-[200px] object-contain drop-shadow-xs"
                  />
                </Link>
              </div>

              {/* Mobile Right: ONLY Circular Cart with Black Badge (Matching Image 2) */}
              <div className="flex items-center shrink-0">
                <Link
                  href="/cart"
                  prefetch={false}
                  className="relative w-9 h-9 rounded-full bg-[#e9ecef] hover:bg-[#dee2e6] text-slate-900 flex items-center justify-center shrink-0 cursor-pointer shadow-2xs active:scale-95"
                  title={t.cart}
                >
                  <ShoppingCart className="w-4.5 h-4.5 text-slate-900 stroke-[2.2]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-0.5 flex items-center justify-center border border-white shadow-xs">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Mobile Row 2: Full-Width Search Pill with Black Squircle Search Button */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center w-full bg-[#f1f3f5] rounded-full border border-gray-200/90 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all shadow-inner h-9.5"
            >
              <Search className="w-4 h-4 text-gray-400 ml-3.5 shrink-0 stroke-[2]" />
              <input
                type="text"
                placeholder={animatedPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                className="w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium pl-2.5 pr-14 py-1.5 text-xs outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery?.('')}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7.5 h-7.5 bg-black text-white rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs shrink-0"
                title="Search"
              >
                <Search className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </button>
            </form>

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
            
            {/* Black Drawer Header (Matching Reference Image 2) */}
            <div className="px-4 py-3.5 bg-black text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-[17px] leading-tight">
                    ক্যাটাগরি
                  </h3>
                  <p className="text-xs text-gray-400 font-normal mt-0.5">
                    12টি কালেকশন
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1.5 text-gray-300 hover:text-white rounded-full transition cursor-pointer"
                aria-label="Close category drawer"
              >
                <X className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>

            {/* White Drawer Navigation List (Directly below header - NO My Orders, NO Language) */}
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
          </div>
        </div>
      )}
    </>
  );
};
