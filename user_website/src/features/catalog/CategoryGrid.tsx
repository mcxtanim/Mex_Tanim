'use client';

import React from 'react';
import { Mouse, Keyboard, Headphones, Zap, Shield, Cable, Speaker, Scissors, Grid } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';

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

  const CATEGORIES = [
    { id: 'all', name: t.categories.all, icon: Grid },
    { id: 'mice', name: t.categories.mice, icon: Mouse },
    { id: 'keyboards', name: t.categories.keyboards, icon: Keyboard },
    { id: 'headphones', name: t.categories.headphones, icon: Headphones },
    { id: 'chargers', name: t.categories.chargers, icon: Zap },
    { id: 'sleeves', name: t.categories.sleeves, icon: Shield },
    { id: 'cables', name: t.categories.cables, icon: Cable },
    { id: 'soundbox', name: t.categories.soundbox, icon: Speaker },
    { id: 'trimmers', name: t.categories.trimmers, icon: Scissors },
  ];

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

      {/* Categories Horizontal Scroll / Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all duration-200 group ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                  : 'bg-white border-gray-200/80 text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:shadow-md'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl mb-2 transition ${
                  isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 group-hover:bg-orange-50 group-hover:text-orange-500'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-center line-clamp-1">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
};
