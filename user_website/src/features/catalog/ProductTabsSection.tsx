'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { fetchLiveProducts, getCachedProducts } from './productService';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';

type TabType = 'featured' | 'bestsellers' | 'newarrivals';

export const ProductTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('featured');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    // 1. Client-side cache hydration (prevents SSR hydration mismatch)
    const cachedProds = getCachedProducts();
    if (cachedProds.length > 0) setAllProducts(cachedProds);

    const loadData = async () => {
      const prods = await fetchLiveProducts();
      setAllProducts(prods);
    };
    loadData();

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAllProducts(e.detail);
      } else {
        loadData();
      }
    };

    window.addEventListener('products_updated', handleProductsUpdate);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('products_updated', handleProductsUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const activeTabProducts = allProducts.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured === true || (!p.isFeatured && !p.isBestSeller && !p.isNewArrival);
    if (activeTab === 'bestsellers') return p.isBestSeller === true;
    if (activeTab === 'newarrivals') return p.isNewArrival === true;
    return true;
  });

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Section Header: Centered Title, Subtitle, and Clean Underlined Tabs (Matching Reference Image) */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          {language === 'bn' ? 'ফিচার্ড পণ্য' : 'Featured Products'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          {language === 'bn' ? 'আপনার পছন্দের পণ্য দেখে নিন!' : 'Take a look at your favorite products!'}
        </p>

        {/* Centered Minimalist Underlined Tabs (Matching Reference Image) */}
        <div className="flex items-center justify-center space-x-6 sm:space-x-10 pt-3 border-b border-gray-200/80">
          <button
            onClick={() => setActiveTab('featured')}
            className={`text-xs sm:text-sm md:text-base transition-all pb-2 cursor-pointer ${
              activeTab === 'featured'
                ? 'font-black text-slate-900 border-b-2 border-slate-900 -mb-px'
                : 'font-semibold text-slate-400 hover:text-slate-700'
            }`}
          >
            {language === 'bn' ? 'ফিচার্ড' : 'Featured'}
          </button>

          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`text-xs sm:text-sm md:text-base transition-all pb-2 cursor-pointer ${
              activeTab === 'bestsellers'
                ? 'font-black text-slate-900 border-b-2 border-slate-900 -mb-px'
                : 'font-semibold text-slate-400 hover:text-slate-700'
            }`}
          >
            {language === 'bn' ? 'বেস্টসেলার' : 'Bestseller'}
          </button>

          <button
            onClick={() => setActiveTab('newarrivals')}
            className={`text-xs sm:text-sm md:text-base transition-all pb-2 cursor-pointer ${
              activeTab === 'newarrivals'
                ? 'font-black text-slate-900 border-b-2 border-slate-900 -mb-px'
                : 'font-semibold text-slate-400 hover:text-slate-700'
            }`}
          >
            {language === 'bn' ? 'নতুন এসেছে' : 'New Arrivals'}
          </button>
        </div>
      </div>

      {/* 5-Column Product Grid (Matching Reference Image) */}
      {activeTabProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-4.5 pt-1">
          {activeTabProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-3xl border border-gray-100 p-6 text-gray-500 text-sm font-bold shadow-2xs">
          {language === 'bn' ? 'এই ট্যাবে কোনো পণ্য পাওয়া যায়নি' : 'No products available in this tab.'}
        </div>
      )}
    </section>
  );
};
