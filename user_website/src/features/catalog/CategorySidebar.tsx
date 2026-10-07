'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CategoryItem, fetchLiveCategories, getCachedCategories, getCategoryProductCount, isCategorySelected, getCategoryName } from './categoryData';
import { fetchLiveProducts, getCachedProducts } from './productService';
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
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Client-side cache hydration (prevents SSR hydration mismatch)
    const cachedCats = getCachedCategories();
    const cachedProds = getCachedProducts();
    if (cachedCats.length > 0) setCategories(cachedCats);
    if (cachedProds.length > 0) setProducts(cachedProds);

    const loadCategoriesAndProducts = async () => {
      const [liveCats, liveProds] = await Promise.all([
        fetchLiveCategories(),
        fetchLiveProducts(),
      ]);
      setCategories(liveCats);
      setProducts(liveProds);
    };
    loadCategoriesAndProducts();

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        loadCategoriesAndProducts();
      }
    };

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProducts(e.detail);
      } else {
        loadCategoriesAndProducts();
      }
    };

    window.addEventListener('categories_updated', handleCategoriesUpdate);
    window.addEventListener('products_updated', handleProductsUpdate);
    window.addEventListener('storage', loadCategoriesAndProducts);
    return () => {
      window.removeEventListener('categories_updated', handleCategoriesUpdate);
      window.removeEventListener('products_updated', handleProductsUpdate);
      window.removeEventListener('storage', loadCategoriesAndProducts);
    };
  }, []);

  // Order categories to match Reference Image 2 exactly
  const orderedCategories = React.useMemo(() => {
    const list = [...categories];
    const orderMap: Record<string, number> = {
      'gaming-cooler': 1,
      'cooler': 1,
      'finger-sleeves': 2,
      'sleeves': 2,
      'gaming-earphone': 3,
      'earphone': 3,
      'gaming-powder': 4,
      'powder': 4,
      'magnetic-plates': 5,
      'plates': 5,
      'gaming-triggers': 6,
      'triggers': 6,
      'power-bank': 7,
      'charger-adapter': 8,
      'cable': 9,
      'cables': 9,
      'gaming-mice': 10,
      'mouse': 10,
      'mechanical-keyboards': 11,
      'keyboard': 11,
      'combo-offers': 12,
      'combo': 12,
    };
    return list.sort((a, b) => {
      const ordA = orderMap[a.id] || 99;
      const ordB = orderMap[b.id] || 99;
      return ordA - ordB;
    });
  }, [categories]);

  return (
    <div className="w-full bg-white divide-y divide-gray-100/70 overflow-hidden">
      {orderedCategories.map((cat) => {
        const isSelected = isCategorySelected(selectedCategory, cat.id);
        const count = getCategoryProductCount(cat.id, cat.staticCount, products);

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors duration-150 group cursor-pointer border-b border-gray-100/60 ${
              isSelected ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/80'
            }`}
          >
            <div className="flex items-center space-x-3.5 min-w-0">
              {/* Colored Squircle Badge (Matching Reference Image 2) */}
              <div
                className={`w-12 h-12 rounded-[14px] flex items-center justify-center font-bold text-xl select-none shrink-0 shadow-xs ${
                  cat.badgeBg || 'bg-black text-white'
                }`}
              >
                {cat.badge}
              </div>

              {/* Category Name & Product Count */}
              <div className="text-left truncate">
                <h3 className="text-[14px] font-bold uppercase tracking-wide truncate text-slate-900 group-hover:text-black">
                  {cat.nameEn || getCategoryName(cat.id, 'en')}
                </h3>
                <p className="text-[13px] font-medium text-slate-400 mt-0.5">
                  {count} products
                </p>
              </div>
            </div>

            {/* Right Chevron Arrow */}
            <ChevronRight
              className="w-4 h-4 text-slate-300 stroke-[2] group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </button>
        );
      })}
    </div>
  );
};
