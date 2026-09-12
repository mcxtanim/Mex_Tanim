'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CATEGORIES, getCategoryProductCount, isCategorySelected } from './categoryData';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-white divide-y divide-gray-100 rounded-b-2xl overflow-hidden shadow-xs">
      {CATEGORIES.map((cat) => {
        const isSelected = isCategorySelected(selectedCategory, cat.id);
        const count = getCategoryProductCount(cat.id, cat.staticCount);

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
              {/* Colored Badge Container (Matching Reference Image 1) */}
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
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
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
