'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Filter, Search, RotateCcw, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { CATEGORIES } from './categoryData';
import { ProductGrid } from './ProductGrid';
import { PRODUCTS } from './mockData';
import { useLanguage } from '../shared/LanguageContext';

interface CategoriesViewProps {
  initialCategory?: string;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ initialCategory = 'all' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { language } = useLanguage();

  const selectedCatObj = CATEGORIES.find((c) => c.id === selectedCategory) || {
    id: 'all',
    nameEn: 'All Categories',
    nameBn: 'সকল ক্যাটাগরি',
    badge: 'A',
    image: '/categories/gaming-mice.svg',
  };

  const getProductCount = (catId: string) => {
    if (catId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter(
      (p) =>
        p.category === catId ||
        (catId === 'finger-sleeves' && p.category === 'sleeves') ||
        (catId === 'sleeves' && p.category === 'finger-sleeves') ||
        (catId === 'soundboxes' && p.category === 'soundbox') ||
        (catId === 'soundbox' && p.category === 'soundboxes') ||
        (catId === 'chargers' && p.category === 'fast-chargers') ||
        (catId === 'fast-chargers' && p.category === 'chargers')
    ).length;
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-extrabold text-orange-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'bn' ? 'ক্যাটাগরি পেজ' : 'Product Categories Catalog'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {language === 'bn' ? 'সকল গেমিং ক্যাটাগরি ও ফিল্টার' : 'Explore All Product Categories'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {language === 'bn' 
                ? 'আপনার পছন্দের ગેમિંગ গ্যাজেট ও অ্যাক্সেসরিজ সহজেই ফিল্টার করুন।' 
                : 'Filter and browse 100% authentic gaming accessories and gadgets.'}
            </p>
          </div>

          {/* Quick Search inside Categories Page */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'ক্যাটাগরি বা প্রোডাক্ট খুঁজুন...' : 'Search categories or products...'}
              className="w-full px-4 py-2.5 pl-10 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Category Filter Pills Bar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-orange-500" />
              {language === 'bn' ? 'ক্যাটাগরি ফিল্টার করুন' : 'Filter By Category'}
            </span>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition"
              >
                <span>{language === 'bn' ? 'রিসেট' : 'Reset Filter'}</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scrollable Pills List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = getProductCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-105'
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

        {/* Category Cards Showcase Grid */}
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-orange-500" />
            {language === 'bn' ? 'সকল ক্যাটাগরি কার্ড' : 'Product Categories Cards'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = getProductCount(cat.id);

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-3xl text-center flex flex-col items-center justify-between h-[150px] transition-all duration-300 cursor-pointer group border ${
                    isActive
                      ? 'bg-white border-2 border-orange-500 shadow-xl scale-105'
                      : 'bg-white hover:bg-orange-50/30 border-gray-200/80 hover:border-orange-400 shadow-xs'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:scale-110 flex items-center justify-center transition-transform p-2">
                    <img src={cat.image} alt={cat.nameEn} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 mt-0.5 inline-block">
                      {count} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filtered Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
              <h3 className="text-base font-bold text-slate-900">
                {language === 'bn' ? selectedCatObj.nameBn : selectedCatObj.nameEn}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {getProductCount(selectedCategory)} {language === 'bn' ? 'টি পণ্য পাওয়া গেছে' : 'items found'}
            </span>
          </div>

          <ProductGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
          />
        </div>
      </div>
    </div>
  );
};
