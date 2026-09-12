'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { CATEGORIES, isCategorySelected } from './categoryData';
import { fetchLiveProducts } from './productService';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';
import {
  Sparkles,
  Flame,
  Zap,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mouse,
  Keyboard,
  Zap as ChargerIcon,
  Hand,
  Cable,
  Speaker,
  Scissors,
  Layers,
} from 'lucide-react';

type TabType = 'featured' | 'bestsellers' | 'newarrivals';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  headphones: <Headphones className="w-5 h-5" />,
  mice: <Mouse className="w-5 h-5" />,
  keyboards: <Keyboard className="w-5 h-5" />,
  chargers: <ChargerIcon className="w-5 h-5" />,
  'finger-sleeves': <Hand className="w-5 h-5" />,
  cables: <Cable className="w-5 h-5" />,
  soundboxes: <Speaker className="w-5 h-5" />,
  trimmers: <Scissors className="w-5 h-5" />,
};

interface CategoryRailProps {
  categoryName: string;
  categoryNameBn: string;
  categoryIcon: React.ReactNode;
  products: Product[];
}

const CategoryRailRow: React.FC<CategoryRailProps> = ({
  categoryName,
  categoryNameBn,
  categoryIcon,
  products,
}) => {
  const { language } = useLanguage();
  const railRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered || !railRef.current) return;

    const interval = setInterval(() => {
      if (railRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = railRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          railRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          railRef.current.scrollBy({ left: 260, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered, products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center shadow-md">
            {categoryIcon}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-wide uppercase">
              {language === 'bn' ? categoryNameBn : categoryName}
            </h3>
            <span className="text-[11px] font-extrabold text-orange-600">
              {products.length} {language === 'bn' ? 'টি এভেলেবল পণ্য' : 'Available Items'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition shadow-xs cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition shadow-xs cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-4 overflow-x-auto scrollbar-none py-2 px-1 snap-x touch-pan-x"
      >
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="min-w-[240px] sm:min-w-[270px] max-w-[280px] shrink-0 snap-start animate-in fade-in slide-in-from-left duration-300"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('featured');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchLiveProducts();
      setAllProducts(data);
    };
    loadProducts();

    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  const activeTabProducts = allProducts.filter((p) => {
    if (activeTab === 'featured') return p.isFeatured === true || (!p.isFeatured && !p.isBestSeller && !p.isNewArrival);
    if (activeTab === 'bestsellers') return p.isBestSeller === true;
    if (activeTab === 'newarrivals') return p.isNewArrival === true;
    return true;
  });

  const categoryGroups = CATEGORIES.map((cat) => {
    const prods = activeTabProducts.filter((p) => isCategorySelected(p.category, cat.id));
    return {
      category: cat,
      products: prods,
    };
  }).filter((group) => group.products.length > 0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full inline-block" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'bn' ? 'ফিচার্ড প্রোডাক্টস' : 'Exclusive Product Showcase'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            {language === 'bn'
              ? 'সেরা ব্র্যান্ডের আসল গ্যাজেট কালেকশন এক পলকে ক্যাটাগরি অনুযায়ী দেখুন'
              : 'Browse 100% authentic gaming gadgets categorized top-to-bottom'}
          </p>
        </div>

        <div className="flex items-center p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-inner self-start md:self-auto">
          <button
            onClick={() => setActiveTab('featured')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === 'featured'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'featured' ? 'animate-spin' : ''}`} />
            <span>{language === 'bn' ? 'ফিচার্ড (Featured)' : 'Featured'}</span>
          </button>

          <button
            onClick={() => setActiveTab('bestsellers')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === 'bestsellers'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>{language === 'bn' ? 'বেস্ট সেলার (Best Sellers)' : 'Best Sellers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('newarrivals')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 cursor-pointer ${
              activeTab === 'newarrivals'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30 scale-105'
                : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{language === 'bn' ? 'নতুন কালেকশন (New Arrivals)' : 'New Arrivals'}</span>
          </button>
        </div>
      </div>

      {categoryGroups.length > 0 ? (
        <div className="space-y-6">
          {categoryGroups.map((group) => (
            <CategoryRailRow
              key={group.category.id}
              categoryName={group.category.nameEn}
              categoryNameBn={group.category.nameBn}
              categoryIcon={CATEGORY_ICONS[group.category.id] || <Layers className="w-5 h-5" />}
              products={group.products}
            />
          ))}
        </div>
      ) : activeTabProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeTabProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-3xl border border-gray-200 p-6 text-gray-500 text-sm font-bold">
          {language === 'bn' ? 'এই ট্যাবে কোনো পণ্য পাওয়া যায়নি' : 'No products available in this tab.'}
        </div>
      )}

    </section>
  );
};
