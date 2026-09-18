'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Home,
  ChevronRight,
  ShoppingBag,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  Sparkles,
  Grid,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  CategoryItem,
  fetchLiveCategories,
  getCategoryProductCount,
  isCategorySelected,
  getCachedCategories,
  getCategoryName,
} from './categoryData';
import { fetchLiveProducts, getCachedProducts } from './productService';
import { Product } from './types';
import { ProductCard } from './ProductCard';
import { useLanguage } from '../shared/LanguageContext';

interface CategoriesViewProps {
  initialCategory?: string;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ initialCategory }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');

  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || initialCategory || 'all');
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'discount'>('default');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const { language } = useLanguage();

  useEffect(() => {
    // 1. Client-side cache hydration (prevents SSR hydration mismatch)
    const cachedCats = getCachedCategories();
    const cachedProds = getCachedProducts();
    if (cachedCats.length > 0) setCategories(cachedCats);
    if (cachedProds.length > 0) setProducts(cachedProds);

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

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      router.replace('/categories', { scroll: false });
    } else {
      router.replace(`/categories?cat=${catId}`, { scroll: false });
    }
  };

  const selectedCatObj = categories.find((c) => isCategorySelected(selectedCategory, c.id)) || {
    id: 'all',
    nameEn: 'ALL PRODUCTS',
    nameBn: 'সকল প্রোডাক্ট',
    badge: 'A',
    badgeBg: 'bg-black text-white',
    image: '/categories/all.svg',
  };

  // Filter products
  let processedProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return isCategorySelected(selectedCategory, p.category);
  });

  // Filter by in-stock if enabled
  if (inStockOnly) {
    processedProducts = processedProducts.filter((p) => p.inStock);
  }

  // Sort products
  if (sortBy === 'price-asc') {
    processedProducts = [...processedProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    processedProducts = [...processedProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    processedProducts = [...processedProducts].sort((a, b) => {
      const discA = a.originalPrice ? a.originalPrice - a.price : 0;
      const discB = b.originalPrice ? b.originalPrice - b.price : 0;
      return discB - discA;
    });
  }

  const activeCategoryTitle =
    language === 'bn'
      ? selectedCatObj.nameBn || getCategoryName(selectedCatObj.id, 'bn')
      : selectedCatObj.nameEn || getCategoryName(selectedCatObj.id, 'en');

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-500 py-2">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1.5 transition">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="hover:text-slate-900 transition">
            {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300" />
          <span className="font-extrabold text-orange-600 uppercase tracking-wide">
            {activeCategoryTitle}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-2">
        
        {/* 2. HORIZONTAL QUICK-SWITCH CATEGORY PILLS */}
        <div className="relative">
          <div className="flex items-center space-x-2 sm:space-x-2.5 overflow-x-auto scrollbar-none py-1 px-0.5">
            {/* All Products Pill */}
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className={`shrink-0 flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/30'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs hover:border-orange-500/40'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সব পণ্য' : 'All Products'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {products.length}
              </span>
            </button>

            {/* Dynamic Category Pills */}
            {categories.map((cat) => {
              const isActive = isCategorySelected(selectedCategory, cat.id);
              const count = getCategoryProductCount(cat.id, cat.staticCount || 0, products);
              const name = language === 'bn' ? cat.nameBn || cat.nameEn : cat.nameEn;
              const IconComp = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`shrink-0 flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/30'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs hover:border-orange-500/40'
                  }`}
                >
                  {IconComp ? (
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                  ) : (
                    <span className="w-3.5 h-3.5 flex items-center justify-center text-[10px] font-black">
                      {cat.badge || '•'}
                    </span>
                  )}
                  <span>{name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PREMIUM CATEGORY HERO BANNER CARD (REPLACES DUPLICATE HEADINGS) */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800/80 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Ambient Decorative Glow */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Info: Icon, Tag, Title & Tagline */}
          <div className="flex items-center space-x-4 sm:space-x-5 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 text-2xl font-black shrink-0 border border-white/20">
              {selectedCatObj.badge || '🔥'}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  {language === 'bn' ? 'ক্যাটাগরি কালেকশন' : 'Category Collection'}
                </span>
                <span className="text-[11px] text-slate-400 font-bold font-mono">
                  {processedProducts.length} {language === 'bn' ? 'টি প্রোডাক্ট' : 'Products'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight font-sans">
                {activeCategoryTitle}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl line-clamp-1">
                {selectedCategory === 'all'
                  ? language === 'bn'
                    ? 'আমাদের কালেকশনের ১০০% অথেনটিক সকল গেমিং অ্যাক্সেসরিজ ও টেক গ্যাজেট।'
                    : 'Explore all 100% authentic gaming gadgets and tech essentials.'
                  : language === 'bn'
                  ? 'অফিসিয়াল ওয়ারেন্টি ও ক্যাশ অন ডেলিভারিসহ সেরা অথেনটিক পণ্য।'
                  : 'Top-rated authentic gear with official warranty and cash on delivery.'}
              </p>
            </div>
          </div>

          {/* Right Controls: Sort & Filter */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
            {/* In-Stock Filter Toggle */}
            <button
              type="button"
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer active:scale-95 border ${
                inStockOnly
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 border-white/15'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  inStockOnly ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{language === 'bn' ? 'স্টকে আছে' : 'In Stock Only'}</span>
            </button>

            {/* Price / Ordering Sort Dropdown */}
            <div className="relative flex items-center bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl px-3 py-1.5 text-xs font-bold text-white transition focus-within:border-orange-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-400 mr-2 shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer pr-1"
              >
                <option value="default" className="bg-slate-900 text-white">
                  {language === 'bn' ? 'সর্ট: ডিফল্ট' : 'Sort: Default'}
                </option>
                <option value="price-asc" className="bg-slate-900 text-white">
                  {language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}
                </option>
                <option value="price-desc" className="bg-slate-900 text-white">
                  {language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}
                </option>
                <option value="discount" className="bg-slate-900 text-white">
                  {language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Biggest Discount'}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. PRODUCTS GRID */}
        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {processedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200/80 shadow-xs space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'bn'
                ? 'নির্বাচিত ফিল্টারে কোনো পণ্য পাওয়া যায়নি'
                : 'No products match your current filters'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'bn'
                ? 'ফিল্টার পরিবর্তন করুন বা অন্য কোনো ক্যাটাগরি বেছে নিন।'
                : 'Try adjusting your filters or select a different category above.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setInStockOnly(false);
                  setSortBy('default');
                  router.replace('/categories', { scroll: false });
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset All Filters'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
