'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/features/shared/Header';
import { HeroBanner } from '@/features/catalog/HeroBanner';
import { CategoryShowcase } from '@/features/catalog/CategoryShowcase';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { ProductTabsSection } from '@/features/catalog/ProductTabsSection';
import { CategoryProductsSection } from '@/features/catalog/CategoryProductsSection';
import { ComboOfferSection } from '@/features/catalog/ComboOfferSection';
import { CategoriesView } from '@/features/catalog/CategoriesView';
import { Footer } from '@/features/shared/Footer';
import { useLanguage } from '@/features/shared/LanguageContext';
import { fetchLiveProducts, getCachedProducts } from '@/features/catalog/productService';
import { CategoryItem, fetchLiveCategories, getCachedCategories, getCategoryName, isCategorySelected } from '@/features/catalog/categoryData';
import { Product } from '@/features/catalog/types';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    // 1. Client-side cache hydration (prevents SSR hydration mismatch)
    const cachedProds = getCachedProducts();
    const cachedCats = getCachedCategories();
    if (cachedProds.length > 0) setProducts(cachedProds);
    if (cachedCats.length > 0) setCategories(cachedCats);

    const loadData = async () => {
      const [prods, cats] = await Promise.all([
        fetchLiveProducts(),
        fetchLiveCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    };
    loadData();

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        loadData();
      }
    };

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProducts(e.detail);
      } else {
        loadData();
      }
    };

    window.addEventListener('categories_updated', handleCategoriesUpdate);
    window.addEventListener('products_updated', handleProductsUpdate);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('categories_updated', handleCategoriesUpdate);
      window.removeEventListener('products_updated', handleProductsUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const matchedCategory = categories.find((c) => isCategorySelected(selectedCategory, c.id));
  const currentMeta = {
    en: matchedCategory ? matchedCategory.nameEn : (selectedCategory === 'all' ? 'All Categories' : getCategoryName(selectedCategory, 'en')),
    bn: matchedCategory ? matchedCategory.nameBn : (selectedCategory === 'all' ? 'সকল ক্যাটাগরি' : getCategoryName(selectedCategory, 'bn')),
    badge: matchedCategory ? matchedCategory.badge : (selectedCategory === 'all' ? 'A' : selectedCategory.charAt(0).toUpperCase()),
  };

  const productCount = products.filter(
    (p) => isCategorySelected(selectedCategory, p.category)
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
          {selectedCategory === 'all' && searchQuery === '' && <HeroBanner />}

          {selectedCategory === 'all' && searchQuery === '' ? (
            <>
              <CategoryShowcase
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
              <ProductTabsSection />
              <CategoryProductsSection onSelectCategory={setSelectedCategory} />
              <ComboOfferSection onSelectCategory={setSelectedCategory} />
            </>
          ) : searchQuery ? (
            <>
              {/* Search Header Bar */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700/60">
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-black text-xl shrink-0">
                    🔍
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-black text-orange-400 uppercase tracking-widest">
                        {language === 'bn' ? 'সার্চ রেজাল্ট' : 'Search Results'}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-white capitalize mt-0.5">
                      "{searchQuery}"
                    </h1>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="relative z-10 self-start sm:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-orange-500/50 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition flex items-center space-x-2 active:scale-95 shadow-sm cursor-pointer"
                >
                  <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'Show All Products'}</span>
                  <RotateCcw className="w-4 h-4 text-orange-400" />
                </button>
              </div>

              {/* Search Product Grid */}
              <ProductGrid
                selectedCategory="all"
                searchQuery={searchQuery}
                onSelectCategory={setSelectedCategory}
              />
            </>
          ) : (
            <CategoriesView initialCategory={selectedCategory} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
