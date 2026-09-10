'use client';

import React from 'react';
import { useLanguage } from '../shared/LanguageContext';
import { CATEGORIES, isCategorySelected } from './categoryData';
import { CategoryThumbnail } from './CategoryThumbnail';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onCloseBrowser?: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
  onCloseBrowser,
}) => {
  const { t } = useLanguage();

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block"></span>
          <span>{t.categoriesTitle}</span>
        </h2>
        <button
          onClick={() => {
            onSelectCategory('all');
            if (onCloseBrowser) onCloseBrowser();
            setTimeout(() => {
              const prodEl = document.getElementById('products');
              if (prodEl) {
                prodEl.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
          className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline transition flex items-center space-x-1 cursor-pointer bg-orange-50 px-3 py-1 rounded-full border border-orange-200"
        >
          <span>{t.viewAll}</span>
          <span>›</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = isCategorySelected(selectedCategory, cat.id);

          return (
            <CategoryThumbnail
              key={cat.id}
              category={cat}
              isSelected={isSelected}
              onClick={() => onSelectCategory(cat.id)}
            />
          );
        })}
      </div>

    </section>
  );
};
