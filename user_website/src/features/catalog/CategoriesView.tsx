'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Home, ChevronRight, Heart, Filter, RotateCcw, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { CATEGORIES, getCategoryProductCount, isCategorySelected } from './categoryData';
import { PRODUCTS } from './mockData';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../shared/LanguageContext';

interface CategoriesViewProps {
  initialCategory?: string;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ initialCategory = 'all' }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const catParam = searchParams.get('cat');

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { language } = useLanguage();

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    router.push(`/categories?cat=${catId}`);
  };

  const selectedCatObj = CATEGORIES.find((c) => isCategorySelected(selectedCategory, c.id)) || {
    id: 'all',
    nameEn: 'ALL PRODUCTS',
    nameBn: 'সকল প্রোডাক্ট',
    badge: 'A',
    badgeBg: 'bg-black text-white',
    image: '/categories/all.svg',
  };

  const productCount = getCategoryProductCount(selectedCategory, 28);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      isCategorySelected(selectedCategory, p.category) ||
      (selectedCategory === 'gaming-cooler' && (p.category === 'cooler' || p.category === 'gaming-cooler')) ||
      (selectedCategory === 'finger-sleeves' && (p.category === 'sleeves' || p.category === 'finger-sleeves')) ||
      (selectedCategory === 'gaming-earphone' && (p.category === 'earphone' || p.category === 'gaming-earphone')) ||
      (selectedCategory === 'gaming-powder' && (p.category === 'powder' || p.category === 'gaming-powder')) ||
      (selectedCategory === 'magnetic-plates' && (p.category === 'plates' || p.category === 'magnetic-plates')) ||
      (selectedCategory === 'gaming-triggers' && (p.category === 'triggers' || p.category === 'gaming-triggers')) ||
      (selectedCategory === 'power-bank' && (p.category === 'powerbank' || p.category === 'power-bank')) ||
      (selectedCategory === 'charger-adapter' && (p.category === 'chargers' || p.category === 'fast-chargers' || p.category === 'charger-adapter')) ||
      (selectedCategory === 'soundboxes' && (p.category === 'soundbox' || p.category === 'soundboxes')) ||
      (selectedCategory === 'chargers' && (p.category === 'fast-chargers' || p.category === 'chargers'));

    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameBn.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Breadcrumb Bar (Matching Reference Image 2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 py-2">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1.5 transition">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-extrabold text-slate-900 uppercase tracking-wide">
            {language === 'bn' ? selectedCatObj.nameBn : selectedCatObj.nameEn}
          </span>
        </nav>
      </div>

      {/* 2. Centered Category Title & Subtext (Matching Reference Image 2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6 sm:py-8 space-y-1.5">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight font-sans">
          {language === 'bn' ? selectedCatObj.nameBn : selectedCatObj.nameEn}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 font-mono">
          {productCount} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 3. Horizontal Scrollable Category Filter Pills */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xs border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" />
              {language === 'bn' ? 'ক্যাটাগরি নির্বাচন করুন' : 'Select Category'}
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => handleCategoryChange('all')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition cursor-pointer"
              >
                <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'View All'}</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              ALL PRODUCTS ({PRODUCTS.length})
            </button>

            {CATEGORIES.map((cat) => {
              const isActive = isCategorySelected(selectedCategory, cat.id);
              const count = getCategoryProductCount(cat.id, cat.staticCount);
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md scale-102'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Left Subhead: "সব পণ্য" (Matching Reference Image 2) */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3 pt-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            {language === 'bn' ? 'সব পণ্য' : 'All Products'}
          </h2>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {filteredProducts.length} {language === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'items'}
          </span>
        </div>

        {/* 5. Product Cards Grid (Matching Reference Image 2) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-xs space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি' : 'No products found in this category'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'bn' ? 'অন্য ক্যাটাগরি ফিল্টার করে দেখুন অথবা সকল পণ্য ব্রাউজ করুন।' : 'Try selecting another category or view all products.'}
            </p>
            <button
              onClick={() => handleCategoryChange('all')}
              className="px-6 py-2.5 bg-slate-900 hover:bg-orange-600 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-md"
            >
              {language === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
