'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CATEGORIES, getCategoryProductCount, isCategorySelected } from './categoryData';

interface CategoryShowcaseProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onCloseBrowser?: () => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
  onCloseBrowser,
}) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    onSelectCategory('all');
    if (onCloseBrowser) onCloseBrowser();
    setTimeout(() => {
      const prodEl = document.getElementById('products');
      if (prodEl) {
        prodEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section id="category-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-6 sm:w-3 sm:h-7 bg-orange-500 rounded-full inline-block shadow-sm"></span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Desktop Left/Right Scroll Arrow Buttons */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-gray-100/80 p-1 rounded-full border border-gray-200/80">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-600 text-slate-700 flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer border border-gray-200/60"
              title="Scroll Left"
              aria-label="Scroll left categories"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-600 text-slate-700 flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer border border-gray-200/60"
              title="Scroll Right"
              aria-label="Scroll right categories"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* View All Button */}
          <button
            onClick={handleViewAll}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-100/80 transition-all flex items-center space-x-1.5 cursor-pointer bg-orange-50 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-orange-200/80 active:scale-95 shadow-2xs"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Thumbnail Rail */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none flex space-x-3 sm:space-x-4 snap-x touch-pan-x py-2 px-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const selected = isCategorySelected(selectedCategory, cat.id);
          const count = getCategoryProductCount(cat.id, cat.staticCount);
          const catName = language === 'bn' ? cat.nameBn : cat.nameEn;

          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
              }}
              className={`snap-start shrink-0 flex-none w-36 sm:w-44 md:w-48 p-4 sm:p-5 rounded-3xl transition-all duration-300 group cursor-pointer text-left flex flex-col justify-between ${
                selected
                  ? 'bg-slate-900 text-white border-2 border-orange-500 shadow-xl shadow-slate-900/25 scale-[1.03] ring-2 ring-orange-500/20'
                  : 'bg-white text-slate-800 border border-gray-200/90 shadow-sm hover:shadow-xl hover:border-orange-400/80 hover:-translate-y-1 hover:bg-gradient-to-b hover:from-white hover:to-orange-50/30'
              }`}
            >
              {/* Category Badge & Icon Container */}
              <div className="flex items-center justify-between w-full mb-4">
                <div className="relative">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm ${
                      selected
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/40'
                        : cat.colorClass
                    }`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                  </div>
                  <span
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center border border-white shadow-xs ${
                      selected
                        ? 'bg-white text-slate-900'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* Status Indicator */}
                {selected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-sm" />
                )}
              </div>

              {/* Category Typography & Product Count */}
              <div>
                <h3
                  className={`text-xs sm:text-sm font-extrabold tracking-wide uppercase line-clamp-1 transition-colors ${
                    selected
                      ? 'text-white'
                      : 'text-slate-900 group-hover:text-orange-600'
                  }`}
                >
                  {catName}
                </h3>
                <p
                  className={`text-[11px] font-semibold mt-1 transition-colors ${
                    selected ? 'text-orange-300' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  {count} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
