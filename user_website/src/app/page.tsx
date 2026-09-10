'use client';

import React, { useState } from 'react';
import { Header } from '@/features/shared/Header';
import { HeroBanner } from '@/features/catalog/HeroBanner';
import { CategoryGrid } from '@/features/catalog/CategoryGrid';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { AppInstallBanner } from '@/features/shared/AppInstallBanner';
import { Footer } from '@/features/shared/Footer';
import { useLanguage } from '@/features/shared/LanguageContext';
import { PRODUCTS } from '@/features/catalog/mockData';
import { RotateCcw } from 'lucide-react';

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { language } = useLanguage();

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
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/50">
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          {selectedCategory === 'all' && <HeroBanner />}

          {selectedCategory === 'all' ? (
            <>
              <CategoryGrid
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <ProductGrid
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={setSelectedCategory}
              />
              <AppInstallBanner />
            </>
          ) : (
            <>
              {/* Category Header Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700/60">
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

                <button
                  onClick={() => setSelectedCategory('all')}
                  className="relative z-10 self-start sm:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-orange-500/50 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 active:scale-95 shadow-sm cursor-pointer"
                >
                  <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}</span>
                  <RotateCcw className="w-4 h-4 text-orange-400" />
                </button>
              </div>

              {/* Category-Only Product Grid */}
              <ProductGrid
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={setSelectedCategory}
              />
              <AppInstallBanner />
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
