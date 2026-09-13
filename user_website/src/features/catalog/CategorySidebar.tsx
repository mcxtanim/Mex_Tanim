'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CATEGORIES, CategoryItem, fetchLiveCategories, getCategoryProductCount, isCategorySelected, getCategoryName } from './categoryData';
import { fetchLiveProducts } from './productService';
import { Product } from './types';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadCategoriesAndProducts = async () => {
      const [liveCats, liveProds] = await Promise.all([
        fetchLiveCategories(),
        fetchLiveProducts(),
      ]);
      setCategories(liveCats);
      setProducts(liveProds);
    };
    loadCategoriesAndProducts();

    window.addEventListener('storage', loadCategoriesAndProducts);
    return () => window.removeEventListener('storage', loadCategoriesAndProducts);
  }, []);

  return (
    <div className="w-full bg-white divide-y divide-gray-100 rounded-b-2xl overflow-hidden shadow-xs">
      {categories.map((cat) => {
        const isSelected = isCategorySelected(selectedCategory, cat.id);
        const count = getCategoryProductCount(cat.id, cat.staticCount, products);

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-200 group cursor-pointer ${
              isSelected
                ? 'bg-slate-100/90 font-bold border-l-4 border-slate-900 pl-3'
                : 'bg-white hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              {/* Colored Badge Container */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm font-mono shrink-0 shadow-2xs ${
                  cat.badgeBg || 'bg-slate-900 text-white'
                }`}
              >
                {cat.badge}
              </div>

              {/* Category Name & Product Count */}
              <div className="text-left truncate">
                <h3
                  className={`text-xs font-extrabold uppercase tracking-wide truncate ${
                    isSelected ? 'text-slate-900 font-black' : 'text-slate-900 group-hover:text-orange-600'
                  }`}
                >
                  {language === 'bn' ? (cat.nameBn || getCategoryName(cat.id, 'bn')) : (cat.nameEn || getCategoryName(cat.id, 'en'))}
                </h3>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {count} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
                </p>
              </div>
            </div>

            {/* Right Chevron Arrow */}
            <ChevronRight
              className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${
                isSelected ? 'text-slate-900 font-bold' : 'text-gray-300 group-hover:text-slate-700'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
