'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Home, ChevronRight, ShoppingBag } from 'lucide-react';
import { CATEGORIES, CategoryItem, fetchLiveCategories, getCategoryProductCount, isCategorySelected } from './categoryData';
import { fetchLiveProducts } from './productService';
import { Product } from './types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../shared/LanguageContext';

interface CategoriesViewProps {
  initialCategory?: string;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ initialCategory = 'all' }) => {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || initialCategory || 'all');
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      const [prods, cats] = await Promise.all([
        fetchLiveProducts(),
        fetchLiveCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    };
    loadData();

    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const selectedCatObj = categories.find((c) => isCategorySelected(selectedCategory, c.id)) || {
    id: 'all',
    nameEn: 'ALL PRODUCTS',
    nameBn: 'সকল প্রোডাক্ট',
    badge: 'A',
    badgeBg: 'bg-black text-white',
    image: '/categories/all.svg',
  };

  const productCount = getCategoryProductCount(selectedCategory, 0, products);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return isCategorySelected(selectedCategory, p.category);
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Breadcrumb Bar */}
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

      {/* 2. Centered Category Title & Count Only */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-6 sm:py-8 space-y-1">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight font-sans">
          {language === 'bn' ? selectedCatObj.nameBn : selectedCatObj.nameEn}
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 font-mono">
          {filteredProducts.length > 0 ? filteredProducts.length : productCount} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 3. Subhead: "সব পণ্য" (All Products) */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
            {language === 'bn' ? 'সব পণ্য' : 'All Products'}
          </h2>
          <span className="text-xs font-semibold text-slate-500 font-mono">
            {filteredProducts.length} {language === 'bn' ? 'টি পণ্য' : 'items'}
          </span>
        </div>

        {/* 4. Products Grid */}
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
              {language === 'bn' ? 'অন্য ক্যাটাগরি বেছে নিন।' : 'Please select another category from the sidebar menu.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
