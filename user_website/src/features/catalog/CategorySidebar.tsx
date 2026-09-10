'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CATEGORIES, getCategoryProductCount, isCategorySelected } from './categoryData';
import { CategoryThumbnail } from './CategoryThumbnail';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onCloseMobile?: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();

  return (
    <div className="w-full space-y-2.5">
      {/* List of Category Cards */}
      {CATEGORIES.map((cat) => {
        const isSelected = isCategorySelected(selectedCategory, cat.id);
        const count = getCategoryProductCount(cat.id, cat.staticCount);

        return (
          <button
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id);
            }}
            className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all duration-300 group cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/20 scale-[1.02]'
                : 'backdrop-blur-md bg-white/85 border border-white/50 shadow-xl shadow-slate-900/5 hover:border-orange-500/40 hover:bg-white/95 hover:shadow-2xl text-slate-800'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              {/* Category SVG Asset Thumbnail Container with Badge */}
              <div className="relative shrink-0">
                <CategoryThumbnail
                  category={cat}
                  variant="icon"
                  isSelected={isSelected}
                />
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center border border-white shadow-xs ${
                    isSelected
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Category Name & Count */}
              <div className="text-left truncate">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider truncate ${
                    isSelected
                      ? 'text-white'
                      : 'text-slate-900 group-hover:text-orange-600'
                  }`}
                >
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </h3>
                <p
                  className={`text-[11px] font-semibold ${
                    isSelected ? 'text-orange-300' : 'text-gray-500'
                  }`}
                >
                  {count} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
                </p>
              </div>
            </div>

            {/* Right Chevron Arrow */}
            <ChevronRight
              className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${
                isSelected
                  ? 'text-orange-400'
                  : 'text-gray-400 group-hover:text-orange-500'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
